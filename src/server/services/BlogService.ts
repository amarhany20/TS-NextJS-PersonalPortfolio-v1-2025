import { BadRequestError, ConflictError, NotFoundError } from '@/server/http/errors';
import {
  BlogRepository,
  type BlogCategoryInput as RepositoryBlogCategoryInput,
  type BlogTagInput as RepositoryBlogTagInput,
} from '@/server/repositories/BlogRepository';
import { serializeBlog, serializeBlogMeta } from '@/server/serializers/blog';
import { nullIfEmpty, parseISODate } from '@/server/server-utils/dates';
import type {
  CreateBlogInput,
  UpdateBlogInput,
  BlogCategoryInput as SchemaCategoryInput,
  BlogTagInput as SchemaTagInput,
} from '@/server/server-validators/api/blog';
import { slugify, calculateReadingTime } from '@/utils/helpers';

const DEFAULT_STATUS = 'draft';

export const BlogService = {
  async listPublishedPosts(filter: { categorySlug?: string; tagSlug?: string } = {}) {
    const records = await BlogRepository.findPublished(filter);
    return records.map(serializeBlogMeta);
  },

  async listAllPosts() {
    const records = await BlogRepository.findAll();
    return records.map(serializeBlog);
  },

  async getPostBySlug(slug: string) {
    const record = await BlogRepository.findBySlug(slug);
    return record ? serializeBlog(record) : null;
  },

  async createPost(input: CreateBlogInput) {
    const title = input.title.trim();
    const content = input.content.trim();

    if (!title || !content) {
      throw new BadRequestError('Title and content are required');
    }

    const slug = await ensureUniqueSlug(input.slug ?? title);
    const status = input.status ?? DEFAULT_STATUS;
    const categories = normalizeCategories(input.categories);
    const tags = normalizeTags(input.tags);
    const record = await BlogRepository.create({
      slug,
      title,
      summary: nullIfEmpty(input.summary),
      content,
      coverImage: nullIfEmpty(input.coverImage),
      status,
      publishedAt: resolvePublishedAt(status, input.publishedAt),
      readingTime: input.readingTime ?? calculateReadingTime(content),
      seo: input.seo,
      meta: input.meta,
      categories,
      tags,
    });

    return serializeBlog(record);
  },

  async updatePost(slug: string, input: UpdateBlogInput) {
    const existing = await BlogRepository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError('Blog post not found');
    }

    const nextSlug =
      input.slug !== undefined ? await ensureUniqueSlug(input.slug, existing.id) : undefined;

    const title = input.title?.trim();
    if (input.title !== undefined && !title) {
      throw new BadRequestError('Title cannot be empty');
    }

    const content = input.content?.trim();
    if (input.content !== undefined && !content) {
      throw new BadRequestError('Content cannot be empty');
    }
    const status = input.status ?? existing.status;
    const publishedAt = resolvePublishedAt(
      status,
      input.publishedAt,
      existing.publishedAt ?? undefined,
    );
    const categories = input.categories ? normalizeCategories(input.categories) : undefined;
    const tags = input.tags ? normalizeTags(input.tags) : undefined;

    const record = await BlogRepository.update(slug, {
      slug: nextSlug,
      title,
      summary: input.summary === undefined ? undefined : nullIfEmpty(input.summary),
      content,
      coverImage: input.coverImage === undefined ? undefined : nullIfEmpty(input.coverImage),
      status,
      publishedAt,
      readingTime:
        input.readingTime ??
        (content ? calculateReadingTime(content) : (existing.readingTime ?? undefined)),
      seo: input.seo,
      meta: input.meta,
      categories,
      tags,
    });

    if (!record) {
      throw new NotFoundError('Blog post not found');
    }

    return serializeBlog(record);
  },

  async deletePost(slug: string) {
    const deleted = await BlogRepository.delete(slug);
    if (!deleted) {
      throw new NotFoundError('Blog post not found');
    }
  },

  async listCategories() {
    return BlogRepository.listCategories();
  },

  async listTags() {
    return BlogRepository.listTags();
  },
};

async function ensureUniqueSlug(candidate: string, excludeId?: string) {
  let base = slugify(candidate).replace(/^-+|-+$/g, '');
  if (!base) {
    base = 'post';
  }

  let attempt = base;
  let counter = 1;

  while (await BlogRepository.isSlugTaken(attempt, excludeId)) {
    counter += 1;
    attempt = `${base}-${counter}`;

    if (counter > 1000) {
      throw new ConflictError('Unable to generate unique slug');
    }
  }

  return attempt;
}

function resolvePublishedAt(status: string, incoming?: string, current?: Date | null) {
  const parsed = incoming ? parseISODate(incoming) : undefined;

  if (status === 'scheduled') {
    if (parsed) {
      return parsed;
    }

    if (current) {
      return current;
    }

    throw new BadRequestError('Scheduled posts require a publish date');
  }

  if (status === 'published') {
    return parsed ?? current ?? new Date();
  }

  return parsed ?? null;
}

function normalizeCategories(values?: SchemaCategoryInput[]): RepositoryBlogCategoryInput[] {
  return normalizeTaxonomy(values, 'category') as RepositoryBlogCategoryInput[];
}

function normalizeTags(values?: SchemaTagInput[]): RepositoryBlogTagInput[] {
  return normalizeTaxonomy(values, 'tag') as RepositoryBlogTagInput[];
}

function normalizeTaxonomy(
  values: (SchemaCategoryInput | SchemaTagInput)[] | undefined,
  fallbackLabel: 'category' | 'tag',
) {
  if (!values?.length) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: Array<{ slug: string; name: string; description?: string | null }> = [];

  for (const value of values) {
    const source = value.slug ?? value.name;
    if (!source) {
      continue;
    }

    const slug = slugify(source).replace(/^-+|-+$/g, '');
    if (!slug || seen.has(slug)) {
      continue;
    }

    seen.add(slug);
    normalized.push({
      slug,
      name: value.name?.trim() || humanizeSlug(slug, fallbackLabel),
      description: nullIfEmpty(value.description),
    });
  }

  return normalized;
}

function humanizeSlug(slug: string, fallbackLabel: string) {
  const label = slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return label || fallbackLabel;
}
