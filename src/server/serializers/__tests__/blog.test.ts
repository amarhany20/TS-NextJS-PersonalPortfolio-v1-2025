import { describe, expect, it } from 'vitest';

import { serializeBlog, serializeBlogMeta } from '@/server/serializers/blog';
import type { DbBlogPost } from '@/server/repositories/BlogRepository';

function buildPost(overrides: Partial<DbBlogPost> = {}): DbBlogPost {
  const now = new Date('2025-01-01T00:00:00.000Z');
  return {
    id: 'post-1',
    slug: 'hello-world',
    title: 'Hello World',
    summary: 'Intro post',
    content: 'Content',
    coverImage: '/cover.png',
    status: 'draft',
    publishedAt: now,
    readingTime: 5,
    seo: { title: 'Hello' },
    meta: { featured: true },
    createdAt: now,
    updatedAt: now,
    categories: [
      { id: 'cat-1', slug: 'guides', name: 'Guides' },
    ],
    tags: [
      { id: 'tag-1', slug: 'nextjs', name: 'Next.js' },
    ],
    ...overrides,
  };
}

describe('blog serializers', () => {
  it('serializes a full blog post', () => {
    const result = serializeBlog(buildPost());

    expect(result).toMatchObject({
      id: 'post-1',
      slug: 'hello-world',
      title: 'Hello World',
      summary: 'Intro post',
      coverImage: '/cover.png',
      status: 'draft',
      publishedAt: '2025-01-01T00:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      readingTime: 5,
      seo: { title: 'Hello' },
      meta: { featured: true },
      categories: [{ slug: 'guides', name: 'Guides' }],
      tags: [{ slug: 'nextjs', name: 'Next.js' }],
    });
  });

  it('serializes meta subset', () => {
    const result = serializeBlogMeta(buildPost({ summary: null, coverImage: null }));

    expect(result).toEqual({
      id: 'post-1',
      slug: 'hello-world',
      title: 'Hello World',
      summary: undefined,
      coverImage: undefined,
      publishedAt: '2025-01-01T00:00:00.000Z',
      readingTime: 5,
      categories: [{ slug: 'guides', name: 'Guides', id: 'cat-1' }],
      tags: [{ slug: 'nextjs', name: 'Next.js', id: 'tag-1' }],
    });
  });
});
