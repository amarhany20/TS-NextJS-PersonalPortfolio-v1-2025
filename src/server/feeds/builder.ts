/**
 * Feed builder.
 *
 * Loads the published portfolio + blog items, merges them into a
 * single time-ordered list, and returns the inputs the RSS / JSON
 * serializers need. This is the only module that touches the database
 * for the feed surface; the serializers stay pure and unit-testable.
 */

import { env } from '@/server/server-validators/env';
import { PortfolioService } from '@/server/services/PortfolioService';
import { BlogService } from '@/server/services/BlogService';
import { SettingsService } from '@/server/services/SettingsService';
import type { FeedChannel, FeedItem, FeedPayload } from './types';

const stripHtml = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const truncate = (value: string, max: number): string => {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1).trimEnd()}…`;
};

const toAbsoluteUrl = (siteUrl: string, path: string): string => {
  if (!siteUrl) {
    return path;
  }
  const normalizedSite = siteUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedSite}${normalizedPath}`;
};

const sortItems = (items: FeedItem[]): FeedItem[] => {
  return [...items].sort((a, b) => {
    const ta = new Date(a.publishedAt).getTime();
    const tb = new Date(b.publishedAt).getTime();
    return tb - ta;
  });
};

const channelFromSettings = (siteUrl: string): FeedChannel => {
  const homeUrl = siteUrl || env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const author = 'Portfolio';

  return {
    title: 'Portfolio',
    description: 'Published portfolio projects and blog posts.',
    siteUrl,
    homeUrl,
    author,
    language: 'en',
  };
};

const nonEmpty = (value: string | null | undefined, fallback: string): string => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export async function buildFeedPayload(): Promise<FeedPayload> {
  const siteContent = await SettingsService.getSiteContent();
  const siteUrl = nonEmpty(siteContent.seo?.siteUrl, env.NEXT_PUBLIC_SITE_URL || '');
  const channel: FeedChannel = {
    ...channelFromSettings(siteUrl),
    title:
      nonEmpty(siteContent.seo?.title, '') || nonEmpty(siteContent.profile?.fullName, 'Portfolio'),
    description:
      nonEmpty(siteContent.seo?.description, '') ||
      nonEmpty(siteContent.hero?.subtitle, '') ||
      'Published portfolio projects and blog posts.',
    author: nonEmpty(siteContent.profile?.fullName, 'Portfolio'),
  };

  const [projects, posts] = await Promise.all([
    PortfolioService.getPublishedProjects().catch(() => []),
    BlogService.listPublishedPosts().catch(() => []),
  ]);

  const projectItems: FeedItem[] = projects
    .filter((project) => project.published)
    .map<FeedItem | null>((project) => {
      const publishedAt = project.publishedAt ?? project.createdAt;
      if (!publishedAt) {
        return null;
      }
      const summarySource = project.summary || project.tagline || project.intro;
      return {
        id: project.slug,
        kind: 'portfolio',
        title: project.title,
        summary: truncate(stripHtml(summarySource), 280),
        url: toAbsoluteUrl(siteUrl, `/portfolio/${project.slug}`),
        publishedAt,
      };
    })
    .filter((item): item is FeedItem => item !== null);

  const postItems: FeedItem[] = posts
    .map<FeedItem | null>((post) => {
      if (!post.publishedAt) {
        return null;
      }
      return {
        id: post.slug,
        kind: 'blog',
        title: post.title,
        summary: truncate(stripHtml(nonEmpty(post.summary, '')), 280),
        url: toAbsoluteUrl(siteUrl, `/blogs/${post.slug}`),
        publishedAt: post.publishedAt,
      };
    })
    .filter((item): item is FeedItem => item !== null);

  return {
    channel,
    items: sortItems([...projectItems, ...postItems]),
  };
}
