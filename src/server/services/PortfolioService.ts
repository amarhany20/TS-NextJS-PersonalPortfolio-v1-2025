import { PortfolioRepository } from '@/server/repositories/PortfolioRepository';
import { serializeProject } from '@/server/serializers/portfolio';
import { nullIfEmpty, parseISODate, parseYearMonth } from '@/server/server-utils/dates';
import { BadRequestError, ConflictError, NotFoundError } from '@/server/http/errors';
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from '@/server/server-validators/api/portfolio';
import { slugify } from '@/utils/helpers';
import { logger } from '@/utils/logger';

export const PortfolioService = {
  async getPublishedProjects() {
    const records = await PortfolioRepository.findPublished();
    return records.map((record) => serializeProject(record, false));
  },

  async getAllProjects() {
    const records = await PortfolioRepository.findAll();
    return records.map((record) => serializeProject(record, true));
  },

  async getProjectBySlug(slug: string) {
    const record = await PortfolioRepository.findBySlug(slug);
    return record ? serializeProject(record, false) : null;
  },

  async getProjectForAdmin(slug: string) {
    const record = await PortfolioRepository.findBySlug(slug);
    return record ? serializeProject(record, true) : null;
  },

  async getProjectSlugs() {
    const records = await PortfolioRepository.findPublished();
    return records.map((record) => record.slug);
  },

  async createProject(input: CreateProjectInput) {
    const baseSlug = input.slug ?? slugify(input.title);
    const slug = await ensureUniqueSlug(baseSlug || input.title);
    const displayOrder = input.displayOrder ?? (await PortfolioRepository.getNextDisplayOrder());
    const published = input.published ?? false;
    const publishedAt = resolvePublishedAt(published, input.publishedAt);

    const record = await PortfolioRepository.create({
      slug,
      title: input.title,
      tagline: input.tagline,
      intro: input.intro,
      summary: input.summary,
      featured: input.featured ?? false,
      visibility: input.visibility,
      access: input.access,
      status: input.status,
      domain: nullIfEmpty(input.domain),
      company: nullIfEmpty(input.company),
      client: nullIfEmpty(input.client),
      website: nullIfEmpty(input.website),
      repository: nullIfEmpty(input.repository),
      role: input.role,
      startDate: parseYearMonth(input.start) ?? undefined,
      endDate: input.end ? (parseYearMonth(input.end) ?? undefined) : undefined,
      stack: input.stack ?? [],
      features: input.features,
      sections: input.sections,
      gallery: input.gallery,
      contentMdx: nullIfEmpty(input.contentMdx),
      confidentialNotes: nullIfEmpty(input.confidentialNotes),
      displayOrder,
      published,
      publishedAt,
    });

    logger.info(`Created portfolio project "${record.title}" (slug: ${record.slug})`);
    return serializeProject(record, true);
  },

  async updateProject(slug: string, input: UpdateProjectInput) {
    const existing = await PortfolioRepository.findBySlug(slug);
    if (!existing) {
      logger.warn(`Failed to update portfolio project: slug "${slug}" not found`);
      throw new NotFoundError('Project not found');
    }

    const nextSlug =
      input.slug !== undefined ? await ensureUniqueSlug(input.slug, existing.id) : undefined;

    const nextPublished = input.published ?? existing.published;
    const publishedAt = resolvePublishedAt(nextPublished, input.publishedAt, existing.publishedAt);

    const record = await PortfolioRepository.update(existing.slug, {
      slug: nextSlug,
      title: input.title,
      tagline: input.tagline,
      intro: input.intro,
      summary: input.summary,
      featured: input.featured,
      visibility: input.visibility,
      access: input.access,
      status: input.status,
      domain: valueOrUndefined(input.domain),
      company: valueOrUndefined(input.company),
      client: valueOrUndefined(input.client),
      website: valueOrUndefined(input.website),
      repository: valueOrUndefined(input.repository),
      role: input.role,
      startDate:
        input.start !== undefined
          ? (parseYearMonth(input.start) ?? existing.startDate ?? undefined)
          : undefined,
      endDate: input.end !== undefined ? parseYearMonth(input.end) : undefined,
      stack: input.stack,
      features: input.features,
      sections: input.sections,
      gallery: input.gallery,
      contentMdx: valueOrUndefined(input.contentMdx),
      confidentialNotes: valueOrUndefined(input.confidentialNotes),
      displayOrder: input.displayOrder,
      published: input.published,
      publishedAt,
    });

    if (!record) {
      throw new NotFoundError('Project not found');
    }

    logger.info(`Updated portfolio project "${record.title}" (slug: ${record.slug})`);
    return serializeProject(record, true);
  },

  async deleteProject(slug: string) {
    const deleted = await PortfolioRepository.delete(slug);
    if (!deleted) {
      logger.warn(`Failed to delete portfolio project: slug "${slug}" not found`);
      throw new NotFoundError('Project not found');
    }
    logger.info(`Deleted portfolio project with slug "${slug}"`);
  },

  async reorderProjects(slugs: string[]) {
    if (!slugs.length) {
      throw new BadRequestError('At least one project must be provided');
    }

    const existing = await PortfolioRepository.findAll();
    const knownSlugs = new Set(existing.map((project) => project.slug));
    const missing = slugs.filter((slug) => !knownSlugs.has(slug));

    if (missing.length > 0) {
      throw new NotFoundError(`Unknown projects: ${missing.join(', ')}`);
    }

    const remainder = existing
      .filter((project) => !slugs.includes(project.slug))
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((project) => project.slug);

    const finalOrder = [...slugs, ...remainder];
    const updates = finalOrder.map((slug, index) => ({ slug, displayOrder: index + 1 }));

    await PortfolioRepository.reorderDisplayOrder(updates);
    logger.info(`Reordered ${updates.length} portfolio projects`);
    return updates;
  },
};

async function ensureUniqueSlug(candidate: string, excludeId?: string) {
  let base = slugify(candidate).replace(/^-+|-+$/g, '');
  if (!base) {
    base = 'project';
  }

  let attempt = base;
  let counter = 1;

  while (await PortfolioRepository.isSlugTaken(attempt, excludeId)) {
    counter += 1;
    attempt = `${base}-${counter}`;
    if (counter > 1000) {
      throw new ConflictError('Unable to generate unique slug');
    }
  }

  return attempt;
}

function resolvePublishedAt(published: boolean, provided?: string, fallback?: Date | null) {
  if (!published) {
    return null;
  }

  if (provided === undefined) {
    return fallback ?? new Date();
  }

  if (!provided) {
    return null;
  }

  const parsed = parseISODate(provided);
  if (!parsed) {
    // The schema validates the format, but guard anyway so an invalid value
    // fails loudly instead of silently publishing "now".
    throw new BadRequestError('publishedAt must be a valid ISO date string');
  }

  return parsed;
}

function valueOrUndefined(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return nullIfEmpty(value);
}
