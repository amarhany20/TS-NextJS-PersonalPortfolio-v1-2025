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

export interface DashboardQuickLink {
  title: string;
  description: string;
  href: string;
  badge?: string;
  status?: DashboardStatIntent;
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
  quickLinks: DashboardQuickLink[];
  meta: DashboardMeta;
}

const REQUIRED_ENV_VARS = ['DATABASE_URL', 'AUTH_SECRET', 'NEXT_PUBLIC_SITE_URL'] as const;

/**
 * Dashboard aggregation service.
 *
 * This service centralizes the admin overview payload so the page stays thin and the metrics/quick
 * links remain easy to test independently.
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
      prisma.media.count(),
      prisma.portfolio.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      prisma.blog.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      prisma.contactSubmission.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      SettingsRepository.get(),
    ]);

    const draftProjects = Math.max(totalProjects - publishedProjects, 0);
    const lastUpdatedAt = [
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

    const quickLinks = buildQuickLinks({
      totalProjects,
      draftProjects,
      unreadContactCount,
      blogDraftCount,
      experienceCount,
      skillCount,
      activeServiceCount,
      certificateCount,
      recommendationCount,
      mediaCount,
    });

    const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => {
      const value = env[key];
      return !value || value.length === 0;
    });

    return {
      stats,
      quickLinks,
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
      href: '/admin/blog',
    },
    {
      label: 'Unread contact messages',
      value: input.unreadContactCount,
      helper: 'Messages marked as "new"',
      href: '/admin/contact',
      intent: input.unreadContactCount > 0 ? 'warning' : 'default',
    },
    {
      label: 'Media assets',
      value: input.mediaCount,
      helper: 'Images and documents in the library',
      href: '/admin/media',
    },
  ];
}

interface BuildQuickLinksInput {
  totalProjects: number;
  draftProjects: number;
  unreadContactCount: number;
  blogDraftCount: number;
  experienceCount: number;

  skillCount: number;
  activeServiceCount: number;
  certificateCount: number;
  recommendationCount: number;
  mediaCount: number;
}

const EXPERIENCE_TARGET = 3;
const SKILL_TARGET = 8;
const MEDIA_TARGET = 5;
const RECOMMENDATION_TARGET = 2;
const CERTIFICATE_TARGET = 1;

interface QuickLinkCandidate extends DashboardQuickLink {
  priority: number;
}

function registerQuickLink(
  list: QuickLinkCandidate[],
  link: Omit<QuickLinkCandidate, 'priority'> & { priority?: number },
) {
  list.push({ ...link, priority: link.priority ?? 1 });
}

function buildQuickLinks(input: BuildQuickLinksInput): DashboardQuickLink[] {
  const links: QuickLinkCandidate[] = [];

  registerQuickLink(links, {
    title: 'Add a portfolio project',
    description: 'Showcase new work to keep the public site fresh.',
    href: '/admin/portfolio/new',
    badge: input.totalProjects === 0 ? 'Start here' : undefined,
    status: input.totalProjects === 0 ? 'warning' : 'default',
    priority: input.totalProjects === 0 ? 4 : 2,
  });

  registerQuickLink(links, {
    title: 'Review drafts',
    description: 'Publish drafts once content is final.',
    href: '/admin/portfolio',
    badge:
      input.draftProjects > 0
        ? `${input.draftProjects} project draft${input.draftProjects === 1 ? '' : 's'}`
        : undefined,
    status: input.draftProjects > 0 ? 'info' : 'default',
    priority: input.draftProjects > 0 ? 3 : 2,
  });

  if (input.experienceCount < EXPERIENCE_TARGET) {
    registerQuickLink(links, {
      title: input.experienceCount === 0 ? 'Document your experience' : 'Grow experience timeline',
      description: 'Add milestones so the home page timeline stays authoritative.',
      href: '/admin/experience/new',
      badge:
        input.experienceCount === 0
          ? 'Empty state'
          : `${Math.max(EXPERIENCE_TARGET - input.experienceCount, 1)} more recommended`,
      status: input.experienceCount === 0 ? 'warning' : 'info',
      priority: input.experienceCount === 0 ? 4 : 3,
    });
  }

  if (input.skillCount < SKILL_TARGET) {
    registerQuickLink(links, {
      title: 'Curate your skills library',
      description: 'Ensure each category showcases at least a handful of proficiencies.',
      href: '/admin/skills',
      badge: `${skillGapLabel(input.skillCount)}`,
      status: 'info',
      priority: 3,
    });
  }

  if (input.activeServiceCount === 0) {
    registerQuickLink(links, {
      title: 'Publish your services',
      description: 'Set active offerings so leads know how to engage you.',
      href: '/admin/services/new',
      badge: 'Missing offering',
      status: 'warning',
      priority: 4,
    });
  }

  if (input.certificateCount < CERTIFICATE_TARGET) {
    registerQuickLink(links, {
      title: 'Upload credentials',
      description: 'Highlight certificates or awards to build trust.',
      href: '/admin/certificates/new',
      badge: 'Show proof',
      status: 'info',
      priority: 3,
    });
  }

  if (input.recommendationCount < RECOMMENDATION_TARGET) {
    registerQuickLink(links, {
      title: 'Gather testimonials',
      description: 'Add recommendations to power credibility sections.',
      href: '/admin/recommendations/new',
      badge: input.recommendationCount === 0 ? 'None yet' : 'Need more',
      status: input.recommendationCount === 0 ? 'warning' : 'info',
      priority: input.recommendationCount === 0 ? 4 : 3,
    });
  }

  if (input.mediaCount < MEDIA_TARGET) {
    const remainingAssets = MEDIA_TARGET - input.mediaCount;
    registerQuickLink(links, {
      title: 'Build the media library',
      description: 'Pre-upload hero images and documents for faster publishing.',
      href: '/admin/media',
      badge: `${remainingAssets} asset${remainingAssets === 1 ? '' : 's'} recommended`,
      status: 'info',
      priority: 2,
    });
  }

  registerQuickLink(links, {
    title: 'Tend to contact inbox',
    description: 'Reply to unread inquiries to maintain momentum.',
    href: '/admin/contact',
    badge: input.unreadContactCount > 0 ? `${input.unreadContactCount} unread` : undefined,
    status: input.unreadContactCount > 0 ? 'warning' : 'default',
    priority: input.unreadContactCount > 0 ? 4 : 2,
  });

  registerQuickLink(links, {
    title: 'Publish blog content',
    description: 'Convert drafts into published posts for SEO gains.',
    href: '/admin/blog',
    badge: input.blogDraftCount > 0 ? `${input.blogDraftCount} draft${input.blogDraftCount === 1 ? '' : 's'}` : undefined,
    status: input.blogDraftCount > 0 ? 'info' : 'default',
    priority: input.blogDraftCount > 0 ? 3 : 2,
  });

  registerQuickLink(links, {
    title: 'Update appearance & theme',
    description: 'Tweak theme tokens, layout, and first-run configuration.',
    href: '/admin/settings/theme',
    status: 'default',
    priority: 1,
  });

  return links
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8)
    .map((candidate) => {
      const { priority, ...link } = candidate;
      void priority;
      return link;
    });
}

function skillGapLabel(currentCount: number): string {
  const remaining = Math.max(SKILL_TARGET - currentCount, 1);
  return `${remaining} more skill${remaining === 1 ? '' : 's'}`;
}
