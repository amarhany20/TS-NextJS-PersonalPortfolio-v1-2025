import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/BlogRepository', () => ({
  BlogRepository: {
    findPublished: vi.fn(),
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    isSlugTaken: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listCategories: vi.fn(),
    listTags: vi.fn(),
  },
}));

vi.mock('@/server/serializers/blog', () => ({
  serializeBlog: vi.fn((record: any) => ({ ...record, serialized: true })),
  serializeBlogMeta: vi.fn((record: any) => ({
    id: record.id,
    title: record.title ?? 'Mock title',
    slug: record.slug ?? 'mock-slug',
    summary: record.summary,
    coverImage: record.coverImage,
    publishedAt: undefined,
    readingTime: record.readingTime,
    categories: record.categories ?? [],
    tags: record.tags ?? [],
  })),
}));

import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { BlogRepository } from '@/server/repositories/BlogRepository';
import { serializeBlog, serializeBlogMeta } from '@/server/serializers/blog';
import { BlogService } from '../BlogService';

describe('BlogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists published posts via serializer meta', async () => {
    vi.mocked(BlogRepository.findPublished).mockResolvedValue([{ id: 'post-1' }] as any);

    const posts = await BlogService.listPublishedPosts();
    expect(BlogRepository.findPublished).toHaveBeenCalledWith({});
    expect(posts).toEqual([
      {
        id: 'post-1',
        title: 'Mock title',
        slug: 'mock-slug',
        categories: [],
        tags: [],
      },
    ]);
  });

  it('creates posts with normalized slug, status, and reading time', async () => {
    vi.mocked(BlogRepository.isSlugTaken).mockResolvedValueOnce(false);
    vi.mocked(BlogRepository.create).mockResolvedValue({ id: 'post-1' } as any);

    const result = await BlogService.createPost({
      title: ' Hello Blog ',
      slug: 'custom-slug',
      summary: '  Intro  ',
      content: ' '.repeat(4) + 'word '.repeat(400),
      status: 'published',
      categories: [{ name: 'Guides' } as any],
      tags: [{ slug: 'nextjs', name: 'Next.js' } as any],
    } as any);

    expect(BlogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'custom-slug',
        title: 'Hello Blog',
        summary: 'Intro',
        status: 'published',
        publishedAt: expect.any(Date),
        readingTime: expect.any(Number),
      }),
    );
    expect(result).toMatchObject({ id: 'post-1', serialized: true });
  });

  it('honors explicit schedule dates when creating scheduled posts', async () => {
    const publishDate = '2025-12-01T10:00:00.000Z';
    vi.mocked(BlogRepository.isSlugTaken).mockResolvedValue(false);
    vi.mocked(BlogRepository.create).mockResolvedValue({ id: 'scheduled-post' } as any);

    await BlogService.createPost({
      title: 'Scheduled',
      content: 'Content body',
      status: 'scheduled',
      publishedAt: publishDate,
    } as any);

    expect(BlogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        publishedAt: new Date(publishDate),
      }),
    );
  });

  it('throws when scheduled post lacks date', async () => {
    await expect(
      BlogService.createPost({
        title: 'Schedule Me',
        content: 'content',
        status: 'scheduled',
      } as any),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('updates posts and enforces slug uniqueness', async () => {
    vi.mocked(BlogRepository.findBySlug).mockResolvedValue({
      id: 'post-1',
      slug: 'hello',
      title: 'Hello',
      content: 'content',
      status: 'draft',
      publishedAt: null,
      readingTime: 3,
    } as any);
    vi.mocked(BlogRepository.isSlugTaken).mockResolvedValueOnce(false);
    vi.mocked(BlogRepository.update).mockResolvedValue({ id: 'post-1', slug: 'hello-world' } as any);

    const result = await BlogService.updatePost('hello', {
      slug: 'hello-world',
      title: '  Updated Title  ',
      content: ' updated content ',
      categories: [{ name: 'Dev Tips' } as any],
    } as any);

    expect(BlogRepository.update).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({
        slug: 'hello-world',
        title: 'Updated Title',
        categories: [{ slug: 'dev-tips', name: 'Dev Tips', description: null }],
      }),
    );
    expect(result).toMatchObject({ id: 'post-1', serialized: true });
  });

  it('keeps scheduled publish date when updating without a new timestamp', async () => {
    const existingDate = new Date('2025-11-15T12:00:00.000Z');
    vi.mocked(BlogRepository.findBySlug).mockResolvedValue({
      id: 'post-1',
      slug: 'hello',
      title: 'Hello',
      content: 'content',
      status: 'scheduled',
      publishedAt: existingDate,
      readingTime: 3,
    } as any);
    vi.mocked(BlogRepository.update).mockResolvedValue({ id: 'post-1' } as any);

    await BlogService.updatePost('hello', {
      status: 'scheduled',
    } as any);

    expect(BlogRepository.update).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ publishedAt: existingDate }),
    );
  });

  it('throws when updating unknown post', async () => {
    vi.mocked(BlogRepository.findBySlug).mockResolvedValue(null);

    await expect(BlogService.updatePost('missing', {} as any)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws when deleting unknown post', async () => {
    vi.mocked(BlogRepository.delete).mockResolvedValue(false);

    await expect(BlogService.deletePost('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});
