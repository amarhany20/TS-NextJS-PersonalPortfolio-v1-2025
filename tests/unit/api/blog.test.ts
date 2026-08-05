import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import { UnauthorizedError } from '@/server/http/errors';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/server/services/BlogService', () => ({
  BlogService: {
    listAllPosts: vi.fn(),
    createPost: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  requireAuth: vi.fn(),
}));

const { BlogService } = await import('@/server/services/BlogService');
const { requireAuth } = await import('@/server/security/session');

import { GET, POST } from '@/app/api/v1/blogs/route';
import { createRequest } from './helpers';

afterEach(() => {
  vi.clearAllMocks();
});

describe('blog api routes', () => {
  it('GET requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await GET();

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
  });

  it('GET lists all posts', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (BlogService.listAllPosts as unknown as Mock).mockResolvedValue([{ slug: 'hello-world' }]);

    const response = await GET();

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.posts).toHaveLength(1);
  });

  it('POST rejects a payload missing content', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});

    const response = await POST(createRequest('/api/v1/blogs', 'POST', { title: 'No body' }));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe('VALIDATION_ERROR');
    expect(BlogService.createPost).not.toHaveBeenCalled();
  });

  it('POST creates a post and returns 201', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (BlogService.createPost as unknown as Mock).mockResolvedValue({ slug: 'hello-world' });

    const response = await POST(
      createRequest('/api/v1/blogs', 'POST', {
        title: 'Hello World',
        content: 'Some post content',
        status: 'draft',
      }),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(BlogService.createPost).toHaveBeenCalledTimes(1);
  });
});
