import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

export interface DbBlogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface DbBlogTag {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  status: string;
  publishedAt?: Date | null;
  readingTime?: number | null;
  seo?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  categories: DbBlogCategory[];
  tags: DbBlogTag[];
}

export interface BlogCategoryInput {
  slug: string;
  name: string;
  description?: string | null;
}

export interface BlogTagInput {
  slug: string;
  name: string;
  description?: string | null;
}

export interface BlogCreateData {
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  status: string;
  publishedAt?: Date | null;
  readingTime?: number | null;
  seo?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  categories?: BlogCategoryInput[];
  tags?: BlogTagInput[];
}

export type BlogUpdateData = Partial<BlogCreateData>;

type PrismaTx = Prisma.TransactionClient;

const BLOG_INCLUDE = {
  categories: {
    include: {
      category: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
};

type BlogWithRelations = Prisma.BlogGetPayload<{ include: typeof BLOG_INCLUDE }>;

export const BlogRepository = {

  async findPublished(filter: { categorySlug?: string; tagSlug?: string } = {}): Promise<DbBlogPost[]> {
    const records = await prisma.blog.findMany({
      where: {
        status: 'published',
        publishedAt: { not: null },
        ...(filter.categorySlug
          ? {
              categories: {
                some: {
                  category: {
                    slug: filter.categorySlug,
                  },
                },
              },
            }
          : {}),
        ...(filter.tagSlug
          ? {
              tags: {
                some: {
                  tag: {
                    slug: filter.tagSlug,
                  },
                },
              },
            }
          : {}),
      },
      orderBy: [
        { publishedAt: 'desc' },
        { updatedAt: 'desc' },
      ],
      include: BLOG_INCLUDE,
    });

    return records.map((record) => mapBlog(record)!);
  },

  async findAll(): Promise<DbBlogPost[]> {
    const records = await prisma.blog.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      include: BLOG_INCLUDE,
    });

    return records.map((record) => mapBlog(record)!);
  },

  async findBySlug(slug: string): Promise<DbBlogPost | null> {
    const record = await prisma.blog.findUnique({
      where: { slug },
      include: BLOG_INCLUDE,
    });

    return mapBlog(record);
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const record = await prisma.blog.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(record);
  },

  async create(data: BlogCreateData): Promise<DbBlogPost> {
    return prisma.$transaction(async (tx) => {
      const blog = await tx.blog.create({
        data: toCreateBlogData(data),
      });

      if (data.categories) {
        await syncCategories(tx, blog.id, data.categories);
      }

      if (data.tags) {
        await syncTags(tx, blog.id, data.tags);
      }

      const record = await tx.blog.findUnique({
        where: { id: blog.id },
        include: BLOG_INCLUDE,
      });

      return mapBlog(record)!;
    });
  },

  async update(slug: string, data: BlogUpdateData): Promise<DbBlogPost | null> {
    try {
      return await prisma.$transaction(async (tx) => {
        const blog = await tx.blog.update({
          where: { slug },
          data: toUpdateBlogData(data),
        });

        if (data.categories) {
          await syncCategories(tx, blog.id, data.categories);
        }

        if (data.tags) {
          await syncTags(tx, blog.id, data.tags);
        }

        const record = await tx.blog.findUnique({
          where: { id: blog.id },
          include: BLOG_INCLUDE,
        });

        return mapBlog(record)!;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(slug: string): Promise<boolean> {
    try {
      await prisma.blog.delete({ where: { slug } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },

  async listCategories(): Promise<DbBlogCategory[]> {
    const records = await prisma.category.findMany({
      orderBy: [{ name: 'asc' }],
    });

    return records.map((record) => ({
      id: record.id,
      slug: record.slug,
      name: record.name,
      description: record.description ?? undefined,
    }));
  },

  async listTags(): Promise<DbBlogTag[]> {
    const records = await prisma.tag.findMany({
      orderBy: [{ name: 'asc' }],
    });

    return records.map((record) => ({
      id: record.id,
      slug: record.slug,
      name: record.name,
      description: record.description ?? undefined,
    }));
  },
};

function mapBlog(record: BlogWithRelations | null): DbBlogPost | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    content: record.content,
    coverImage: record.coverImage ?? undefined,
    status: record.status,
    publishedAt: record.publishedAt,
    readingTime: record.readingTime ?? undefined,
    seo: parseJson<Record<string, unknown> | undefined>(record.seo, undefined),
    meta: parseJson<Record<string, unknown> | undefined>(record.meta, undefined),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    categories: record.categories.map(({ category }) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description ?? undefined,
    })),
    tags: record.tags.map(({ tag }) => ({
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
      description: tag.description ?? undefined,
    })),
  };
}

function toCreateBlogData(data: BlogCreateData): Prisma.BlogCreateInput {
  return {
    slug: data.slug,
    title: data.title,
    summary: data.summary ?? null,
    content: data.content,
    coverImage: data.coverImage ?? null,
    status: data.status,
    publishedAt: data.publishedAt ?? null,
    readingTime: data.readingTime ?? null,
    seo: data.seo ? JSON.stringify(data.seo) : null,
    meta: data.meta ? JSON.stringify(data.meta) : null,
  };
}

function toUpdateBlogData(data: BlogUpdateData): Prisma.BlogUpdateInput {
  return {
    ...(data.slug !== undefined ? { slug: data.slug } : {}),
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.summary !== undefined ? { summary: data.summary ?? null } : {}),
    ...(data.content !== undefined ? { content: data.content } : {}),
    ...(data.coverImage !== undefined ? { coverImage: data.coverImage ?? null } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt ?? null } : {}),
    ...(data.readingTime !== undefined ? { readingTime: data.readingTime } : {}),
    ...(data.seo !== undefined ? { seo: data.seo ? JSON.stringify(data.seo) : null } : {}),
    ...(data.meta !== undefined ? { meta: data.meta ? JSON.stringify(data.meta) : null } : {}),
  };
}

async function syncCategories(tx: PrismaTx, blogId: string, categories: BlogCategoryInput[]) {
  await tx.blogCategory.deleteMany({ where: { blogId } });

  if (!categories.length) {
    return;
  }

  const ensured = await ensureCategories(tx, categories);
  await tx.blogCategory.createMany({
    data: ensured.map((category) => ({
      blogId,
      categoryId: category.id,
    })),
  });
}

async function syncTags(tx: PrismaTx, blogId: string, tags: BlogTagInput[]) {
  await tx.blogTag.deleteMany({ where: { blogId } });

  if (!tags.length) {
    return;
  }

  const ensured = await ensureTags(tx, tags);
  await tx.blogTag.createMany({
    data: ensured.map((tag) => ({
      blogId,
      tagId: tag.id,
    })),
  });
}

async function ensureCategories(tx: PrismaTx, categories: BlogCategoryInput[]) {
  const results = [];

  for (const category of categories) {
    const result = await tx.category.upsert({
      where: { slug: category.slug },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description ?? null,
      },
      update: {
        name: category.name,
        description: category.description ?? null,
      },
    });

    results.push(result);
  }

  return results;
}

async function ensureTags(tx: PrismaTx, tags: BlogTagInput[]) {
  const results = [];

  for (const tag of tags) {
    const result = await tx.tag.upsert({
      where: { slug: tag.slug },
      create: {
        slug: tag.slug,
        name: tag.name,
        description: tag.description ?? null,
      },
      update: {
        name: tag.name,
        description: tag.description ?? null,
      },
    });

    results.push(result);
  }

  return results;
}
