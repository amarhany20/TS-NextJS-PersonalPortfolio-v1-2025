import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import { UnauthorizedError } from '@/server/http/errors';

vi.mock('@/server/services/PortfolioService', () => ({
  PortfolioService: {
    getAllProjects: vi.fn(),
    createProject: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  requireAuth: vi.fn(),
}));

const { PortfolioService } = await import('@/server/services/PortfolioService');
const { requireAuth } = await import('@/server/security/session');

import { GET, POST } from '@/app/api/v1/portfolio/route';
import { createRequest } from './helpers';

afterEach(() => {
  vi.clearAllMocks();
});

describe('portfolio api routes', () => {
  it('GET requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await GET();

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe('UNAUTHORIZED');
    expect(PortfolioService.getAllProjects).not.toHaveBeenCalled();
  });

  it('GET lists all projects', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (PortfolioService.getAllProjects as unknown as Mock).mockResolvedValue([
      { slug: 'hello-world' },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.projects).toHaveLength(1);
  });

  it('POST rejects an invalid payload without calling the service', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});

    const response = await POST(createRequest('/api/v1/portfolio', 'POST', { title: '' }));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe('VALIDATION_ERROR');
    expect(PortfolioService.createProject).not.toHaveBeenCalled();
  });

  it('POST creates a project and returns 201', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (PortfolioService.createProject as unknown as Mock).mockResolvedValue({ slug: 'hello-world' });

    const response = await POST(
      createRequest('/api/v1/portfolio', 'POST', {
        title: 'Hello World',
        tagline: 'A demo project',
        intro: 'Intro text',
        summary: 'Summary text',
        visibility: 'public',
        access: 'open-source',
        status: 'live',
        role: 'Developer',
        start: '2026-01',
        stack: ['React', 'Next.js'],
      }),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(PortfolioService.createProject).toHaveBeenCalledTimes(1);
  });
});
