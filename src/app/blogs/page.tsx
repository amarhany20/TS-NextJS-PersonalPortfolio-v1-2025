import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SettingsService } from '@/server/services/SettingsService';
import { BlogService } from '@/server/services/BlogService';
import { BlogListClient } from './BlogListClient';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await SettingsService.getSiteContent();
    const siteTitle = settings.seo?.title || settings.profile?.fullName || 'Portfolio';
    const siteUrl = settings.seo?.siteUrl || '';
    const blogUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/blogs` : '';

    return {
      title: 'Blog',
      description: `Blog posts by ${siteTitle}.`,
      alternates: blogUrl ? { canonical: blogUrl } : undefined,
    };
  } catch {
    return { title: 'Blog' };
  }
}

/**
 * Blog index page.
 *
 * This server component loads published blog metadata through the service layer and hands it to
 * the client list renderer.
 */
export default async function BlogsPage() {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.blogs) {
    notFound();
  }

  const posts = await BlogService.listPublishedPosts();

  return <BlogListClient posts={posts} />;
}
