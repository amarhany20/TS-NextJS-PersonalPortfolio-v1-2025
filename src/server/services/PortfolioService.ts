import { PortfolioRepository } from '@/server/repositories/PortfolioRepository';
import { serializeProject } from '@/server/serializers/portfolio';
import { nullIfEmpty, parseISODate, parseYearMonth } from '@/server/server-utils/dates';
import { ConflictError, NotFoundError } from '@/server/http/errors';
import type { CreateProjectInput, UpdateProjectInput } from '@/server/server-validators/api/portfolio';
import { slugify } from '@/utils/helpers';

export const PortfolioService = {
  async getPublishedProjects() {
    const records = await PortfolioRepository.findPublished();
    return records.map(serializeProject);
  },

  async getAllProjects() {
    const records = await PortfolioRepository.findAll();
    return records.map(serializeProject);
  },

  async getProjectBySlug(slug: string) {
    const record = await PortfolioRepository.findBySlug(slug);
    return record ? serializeProject(record) : null;
  },

  async getProjectSlugs() {
    const records = await PortfolioRepository.findPublished();
    return records.map((record) => record.slug);
  },

  async createProject(input: CreateProjectInput) {
    const baseSlug = input.slug ?? slugify(input.title);
    const slug = await ensureUniqueSlug(baseSlug || input.title);
    const displayOrder =
      input.displayOrder ?? (await PortfolioRepository.getNextDisplayOrder());
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
      endDate: input.end ? parseYearMonth(input.end) ?? undefined : undefined,
      stack: input.stack ?? [],
      features: input.features,
      sections: input.sections,
      gallery: input.gallery,
      confidentialNotes: nullIfEmpty(input.confidentialNotes),
      displayOrder,
      published,
      publishedAt,
    });

    return serializeProject(record);
  },

  async updateProject(slug: string, input: UpdateProjectInput) {
    const existing = await PortfolioRepository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    const nextSlug =
      input.slug !== undefined
        ? await ensureUniqueSlug(input.slug, existing.id)
        : undefined;

    const nextPublished = input.published ?? existing.published;
    const publishedAt = resolvePublishedAt(
      nextPublished,
      input.publishedAt,
      existing.publishedAt,
    );

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
          ? parseYearMonth(input.start) ?? existing.startDate ?? undefined
          : undefined,
      endDate:
        input.end !== undefined
          ? parseYearMonth(input.end)
          : undefined,
      stack: input.stack,
      features: input.features,
      sections: input.sections,
      gallery: input.gallery,
      confidentialNotes: valueOrUndefined(input.confidentialNotes),
      displayOrder: input.displayOrder,
      published: input.published,
      publishedAt,
    });

    if (!record) {
      throw new NotFoundError('Project not found');
    }

    return serializeProject(record);
  },

  async deleteProject(slug: string) {
    const deleted = await PortfolioRepository.delete(slug);
    if (!deleted) {
      throw new NotFoundError('Project not found');
    }
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

function resolvePublishedAt(
  published: boolean,
  provided?: string,
  fallback?: Date | null,
) {
  if (!published) {
    return null;
  }

  if (provided === undefined) {
    return fallback ?? new Date();
  }

  if (!provided) {
    return null;
  }

  return parseISODate(provided) ?? new Date();
}

function valueOrUndefined(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

    return nullIfEmpty(value);
}
