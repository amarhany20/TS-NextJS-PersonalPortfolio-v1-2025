import type { DbBlogPost } from '@/server/repositories/BlogRepository';
import type { Blog, BlogMeta } from '@/types/blog';

export function serializeBlog(post: DbBlogPost): Blog {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary ?? undefined,
    content: post.content,
    coverImage: post.coverImage ?? undefined,
    status: post.status as Blog['status'],
    publishedAt: post.publishedAt?.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
    readingTime: post.readingTime ?? undefined,
    seo: post.seo ?? undefined,
    meta: post.meta ?? undefined,
    categories: post.categories,
    tags: post.tags,
  };
}

export function serializeBlogMeta(post: DbBlogPost): BlogMeta {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary ?? undefined,
    coverImage: post.coverImage ?? undefined,
    publishedAt: post.publishedAt?.toISOString(),
    readingTime: post.readingTime ?? undefined,
    categories: post.categories,
    tags: post.tags,
  };
}
