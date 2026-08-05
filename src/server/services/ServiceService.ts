import { ServiceRepository } from '@/server/repositories/ServiceRepository';
import { serializeService } from '@/server/serializers/service';
import { BadRequestError, ConflictError, NotFoundError } from '@/server/http/errors';
import { nullIfEmpty } from '@/server/server-utils/dates';
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from '@/server/server-validators/api/service';
import { slugify } from '@/utils/helpers';

export const ServiceService = {
  async getActiveServices() {
    const records = await ServiceRepository.findActive();
    return records.map(serializeService);
  },

  async getAllServices() {
    const records = await ServiceRepository.findAll();
    return records.map(serializeService);
  },

  async getServiceBySlug(slug: string) {
    const record = await ServiceRepository.findBySlug(slug);
    return record ? serializeService(record) : null;
  },

  async createService(input: CreateServiceInput) {
    const baseSlug = input.slug ?? slugify(input.title);
    const slug = await ensureUniqueSlug(baseSlug || input.title);
    const record = await ServiceRepository.create({
      slug,
      title: input.title,
      description: input.description,
      longDescription: nullIfEmpty(input.longDescription),
      features: input.features,
      technologies: input.technologies,
      icon: nullIfEmpty(input.icon),
      image: nullIfEmpty(input.image),
      active: input.active ?? true,
      displayOrder: input.displayOrder ?? (await ServiceRepository.getNextDisplayOrder()),
    });

    return serializeService(record);
  },

  async updateService(slug: string, input: UpdateServiceInput) {
    const existing = await ServiceRepository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError('Service not found');
    }

    const nextSlug =
      input.slug !== undefined ? await ensureUniqueSlug(input.slug, existing.id) : undefined;

    const record = await ServiceRepository.update(slug, {
      slug: nextSlug,
      title: input.title,
      description: input.description,
      longDescription: valueOrNull(input.longDescription),
      features: input.features,
      technologies: input.technologies,
      icon: valueOrNull(input.icon),
      image: valueOrNull(input.image),
      active: input.active,
      displayOrder: input.displayOrder,
    });

    if (!record) {
      throw new NotFoundError('Service not found');
    }

    return serializeService(record);
  },

  async deleteService(slug: string) {
    const deleted = await ServiceRepository.delete(slug);
    if (!deleted) {
      throw new NotFoundError('Service not found');
    }
  },

  async reorderServices(slugs: string[]) {
    if (!slugs.length) {
      throw new BadRequestError('At least one service must be provided');
    }

    const existing = await ServiceRepository.findAll();
    const knownSlugs = new Set(existing.map((service) => service.slug));
    const missing = slugs.filter((slug) => !knownSlugs.has(slug));

    if (missing.length > 0) {
      throw new NotFoundError(`Unknown services: ${missing.join(', ')}`);
    }

    const remainder = existing
      .filter((service) => !slugs.includes(service.slug))
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((service) => service.slug);

    const finalOrder = [...slugs, ...remainder];
    const updates = finalOrder.map((slug, index) => ({ slug, displayOrder: index + 1 }));

    await ServiceRepository.reorderDisplayOrder(updates);
    return updates;
  },
};

async function ensureUniqueSlug(candidate: string, excludeId?: string) {
  let base = slugify(candidate).replace(/^-+|-+$/g, '');
  if (!base) {
    base = 'service';
  }

  let attempt = base;
  let counter = 1;

  while (await ServiceRepository.isSlugTaken(attempt, excludeId)) {
    counter += 1;
    attempt = `${base}-${counter}`;
    if (counter > 1000) {
      throw new ConflictError('Unable to generate unique slug');
    }
  }

  return attempt;
}

function valueOrNull(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return nullIfEmpty(value);
}
