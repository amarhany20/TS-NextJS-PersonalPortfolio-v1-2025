import prisma from '@/server/db/prisma';
import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { env } from '@/server/server-validators/env';

/**
 * Dashboard summary models used by the admin landing page.
 */
export type DashboardStatIntent = 'default' | 'warning' | 'info';

export interface DashboardStat {
  label: string;
  value: number;
  helper?: string;
  href?: string;
  intent?: DashboardStatIntent;
}

export interface DashboardMeta {
  lastUpdatedAt: Date | null;
  maintenanceMode: boolean;
  pendingSetup: boolean;
  siteTitle: string;
  theme: string;
  missingEnvVars: string[];
}

export interface DashboardOverview {
  stats: DashboardStat[];
  meta: DashboardMeta;
}

const REQUIRED_ENV_VARS = ['DATABASE_URL', 'AUTH_SECRET', 'NEXT_PUBLIC_SITE_URL'] as const;

/**
 * Dashboard aggregation service.
 *
 * This service centralizes the admin overview payload so the page stays thin and the metrics
 * remain easy to test independently.
 */
export const DashboardService = {
  async getAdminOverview(): Promise<DashboardOverview> {
    const [
      totalProjects,
      publishedProjects,
      experienceCount,
      educationCount,
      skillCount,
      activeServiceCount,
      certificateCount,
      recommendationCount,
      blogPublishedCount,
      blogDraftCount,
      unreadContactCount,
      mediaCount,
      latestPortfolioUpdate,
      latestBlogUpdate,
      latestContactSubmission,
      settings,
    ] = await Promise.all([
      prisma.portfolio.count(),
      prisma.portfolio.count({ where: { published: true } }),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.skill.count(),
      prisma.service.count({ where: { active: true } }),
      prisma.certificate.count(),
      prisma.recommendation.count(),
      prisma.blog.count({ where: { status: 'published' } }),
      prisma.blog.count({ where: { status: { not: 'published' } } }),
      prisma.contactSubmission.count({ where: { status: 'new' } }),
      prisma.attachment.count(),
      prisma.portfolio.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      prisma.blog.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      prisma.contactSubmission.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      SettingsRepository.get(),
    ]);

    const draftProjects = Math.max(totalProjects - publishedProjects, 0);
    const lastUpdatedAt =
      [
        latestPortfolioUpdate?.updatedAt ?? null,
        latestBlogUpdate?.updatedAt ?? null,
        latestContactSubmission?.createdAt ?? null,
        settings?.updatedAt ?? null,
      ]
        .filter((value): value is Date => Boolean(value))
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    const stats = buildStats({
      totalProjects,
      publishedProjects,
      draftProjects,
      experienceCount,
      educationCount,
      skillCount,
      activeServiceCount,
      certificateCount,
      recommendationCount,
      blogPublishedCount,
      blogDraftCount,
      unreadContactCount,
      mediaCount,
    });

    const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => {
      const value = env[key];
      return !value || value.length === 0;
    });

    return {
      stats,
      meta: {
        lastUpdatedAt,
        maintenanceMode: settings?.maintenanceMode ?? false,
        pendingSetup: false,
        siteTitle: settings?.siteTitle ?? 'Portfolio Creator',
        theme: settings?.theme ?? 'default',
        missingEnvVars,
      },
    };
  },
};

interface BuildStatsInput {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  experienceCount: number;
  educationCount: number;
  skillCount: number;
  activeServiceCount: number;
  certificateCount: number;
  recommendationCount: number;
  blogPublishedCount: number;
  blogDraftCount: number;
  unreadContactCount: number;
  mediaCount: number;
}

function buildStats(input: BuildStatsInput): DashboardStat[] {
  return [
    {
      label: 'Portfolio projects',
      value: input.totalProjects,
      helper: `${input.publishedProjects} published · ${input.draftProjects} draft`,
      href: '/admin/portfolio',
      intent: input.draftProjects > 0 ? 'info' : 'default',
    },
    {
      label: 'Experience entries',
      value: input.experienceCount,
      helper: 'Timeline items powering the home page',
      href: '/admin/experience',
    },
    {
      label: 'Education records',
      value: input.educationCount,
      helper: 'Displayed on home and resume exports',
      href: '/admin/education',
    },
    {
      label: 'Skills tracked',
      value: input.skillCount,
      helper: 'Across all categories/groups',
      href: '/admin/skills',
    },
    {
      label: 'Active services',
      value: input.activeServiceCount,
      helper: 'Marketable offerings currently shown',
      href: '/admin/services',
    },
    {
      label: 'Certificates',
      value: input.certificateCount,
      helper: 'Credentials and awards',
      href: '/admin/certificates',
    },
    {
      label: 'Recommendations',
      value: input.recommendationCount,
      helper: 'Testimonials powering trust sections',
      href: '/admin/recommendations',
    },
    {
      label: 'Blog posts',
      value: input.blogPublishedCount,
      helper: `${input.blogDraftCount} draft${input.blogDraftCount === 1 ? '' : 's'} awaiting publish`,
      href: '/admin/blogs',
    },
    {
      label: 'Unread contact messages',
      value: input.unreadContactCount,
      helper: 'Messages marked as "new"',
      href: '/admin/contact',
      intent: input.unreadContactCount > 0 ? 'warning' : 'default',
    },
    {
      label: 'Attachments',
      value: input.mediaCount,
      helper: 'Images and documents in the library',
      href: '/admin/attachments',
    },
  ];
}
