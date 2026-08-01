import { describe, expect, it, vi } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

vi.mock('@/server/services/SettingsService', () => ({
  SettingsService: {
    getSiteContent: vi.fn().mockResolvedValue({
      seo: {
        siteUrl: 'https://example.com',
      },
      visibility: {
        pages: {
          portfolio: true,
          blogs: true,
          services: true,
        },
      },
      maintenanceMode: false,
    }),
  },
}));

vi.mock('@/server/services/PortfolioService', () => ({
  PortfolioService: {
    getPublishedProjects: vi
      .fn()
      .mockResolvedValue([{ slug: 'project-1', updatedAt: '2026-07-31T00:00:00.000Z' }]),
  },
}));

vi.mock('@/server/services/BlogService', () => ({
  BlogService: {
    listPublishedPosts: vi
      .fn()
      .mockResolvedValue([{ slug: 'post-1', publishedAt: '2026-07-31T00:00:00.000Z' }]),
  },
}));

describe('SEO System (robots.txt & sitemap.xml)', () => {
  it('generates correct crawler rules in robots.txt', async () => {
    const res = await robots();
    expect(res.sitemap).toBe('https://example.com/sitemap.xml');
    expect(res.rules).toEqual([
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ]);
  });

  it('generates dynamic sitemap routes containing home, portfolio, services, and blogs', async () => {
    const res = await sitemap();
    const urls = res.map((r) => r.url);

    expect(urls).toContain('https://example.com/home');
    expect(urls).toContain('https://example.com/portfolio');
    expect(urls).toContain('https://example.com/portfolio/project-1');
    expect(urls).toContain('https://example.com/services');
    expect(urls).toContain('https://example.com/blogs');
    expect(urls).toContain('https://example.com/blogs/post-1');
  });
});
