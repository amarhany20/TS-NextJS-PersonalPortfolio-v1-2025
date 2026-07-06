import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/server/server-validators/env', () => ({
  env: {
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test',
    JWT_SECRET: 'test-secret',
  },
  validateEnv: vi.fn(),
}));

const prismaMock = {
  portfolio: {
    count: vi.fn(),
    findFirst: vi.fn(),
  },
  experience: {
    count: vi.fn(),
  },
  education: {
    count: vi.fn(),
  },
  skill: {
    count: vi.fn(),
  },
  service: {
    count: vi.fn(),
  },
  certificate: {
    count: vi.fn(),
  },
  recommendation: {
    count: vi.fn(),
  },
  blog: {
    count: vi.fn(),
    findFirst: vi.fn(),
  },
  contactSubmission: {
    count: vi.fn(),
    findFirst: vi.fn(),
  },
  media: {
    count: vi.fn(),
  },
};

vi.mock('@/server/db/prisma', () => ({
  __esModule: true,
  default: prismaMock,
  prisma: prismaMock,
}));

vi.mock('@/server/repositories/SettingsRepository', () => ({
  SettingsRepository: {
    get: vi.fn(),
  },
}));

import { SettingsRepository } from '@/server/repositories/SettingsRepository';

let DashboardService: typeof import('@/server/services/DashboardService')['DashboardService'];

describe('DashboardService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    Object.values(prismaMock).forEach((model) => {
      Object.values(model as Record<string, Mock>).forEach((method) => method.mockReset());
    });
    ({ DashboardService } = await import('@/server/services/DashboardService'));

  });

  it('returns aggregated stats and quick links', async () => {
    prismaMock.portfolio.count.mockResolvedValueOnce(5).mockResolvedValueOnce(3);
    prismaMock.experience.count.mockResolvedValue(4);
    prismaMock.education.count.mockResolvedValue(2);
    prismaMock.skill.count.mockResolvedValue(8);
    prismaMock.service.count.mockResolvedValue(3);
    prismaMock.certificate.count.mockResolvedValue(6);
    prismaMock.recommendation.count.mockResolvedValue(2);
    prismaMock.blog.count.mockImplementation(({ where }: { where?: Record<string, unknown> }) => {
      if (where?.status === 'published') {
        return Promise.resolve(1);
      }

      if (where?.status && typeof where.status === 'object') {
        return Promise.resolve(2);
      }

      return Promise.resolve(2);
    });
    prismaMock.contactSubmission.count.mockResolvedValue(1);
    prismaMock.media.count.mockResolvedValue(9);
    prismaMock.portfolio.findFirst.mockResolvedValue({ updatedAt: new Date('2025-01-02T10:00:00Z') });
    prismaMock.blog.findFirst.mockResolvedValue({ updatedAt: new Date('2025-01-01T08:00:00Z') });
    prismaMock.contactSubmission.findFirst.mockResolvedValue({ createdAt: new Date('2025-01-03T12:00:00Z') });
    vi.mocked(SettingsRepository.get).mockResolvedValue({
      siteTitle: 'Portfolio',
      maintenanceMode: false,
      theme: 'theme-1',
      updatedAt: new Date('2025-01-04T12:00:00Z'),
      setupCompletedAt: new Date('2025-01-02T00:00:00Z'),
    } as any);

    const overview = await DashboardService.getAdminOverview();

    expect(overview.stats[0]).toMatchObject({ value: 5, helper: '3 published · 2 draft' });
    expect(overview.stats.some((stat) => stat.label === 'Unread contact messages')).toBe(true);
    expect(overview.quickLinks.length).toBeGreaterThan(0);
    expect(overview.quickLinks.length).toBeLessThanOrEqual(8);
    expect(overview.meta.pendingSetup).toBe(false);
    expect(overview.meta.lastUpdatedAt?.toISOString()).toBe('2025-01-04T12:00:00.000Z');
  });

  it('flags pending setup and missing env vars', async () => {
    prismaMock.portfolio.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    prismaMock.experience.count.mockResolvedValue(0);
    prismaMock.education.count.mockResolvedValue(0);
    prismaMock.skill.count.mockResolvedValue(0);
    prismaMock.service.count.mockResolvedValue(0);
    prismaMock.certificate.count.mockResolvedValue(0);
    prismaMock.recommendation.count.mockResolvedValue(0);
    prismaMock.blog.count.mockResolvedValue(0);
    prismaMock.contactSubmission.count.mockResolvedValue(0);
    prismaMock.media.count.mockResolvedValue(0);
    prismaMock.portfolio.findFirst.mockResolvedValue(null);
    prismaMock.blog.findFirst.mockResolvedValue(null);
    prismaMock.contactSubmission.findFirst.mockResolvedValue(null);
    vi.mocked(SettingsRepository.get).mockResolvedValue(null);

    const previousEnv = process.env.NEXT_PUBLIC_SITE_URL;
    const previousAuth = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = '';
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    vi.resetModules();
    const { DashboardService: reloadedDashboardService } = await import('@/server/services/DashboardService');

    const overview = await reloadedDashboardService.getAdminOverview();

    expect(overview.meta.pendingSetup).toBe(false);
    expect(overview.meta.missingEnvVars).toContain('AUTH_SECRET');
    
    expect(overview.quickLinks.some((link) => link.href === '/admin/experience/new')).toBe(true);
    expect(overview.quickLinks.some((link) => link.href === '/admin/services/new')).toBe(true);


    process.env.NEXT_PUBLIC_SITE_URL = previousEnv;
    process.env.AUTH_SECRET = previousAuth;
  });
});
