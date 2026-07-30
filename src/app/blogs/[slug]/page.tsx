import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogService } from '@/server/services/BlogService';
import { SettingsService } from '@/server/services/SettingsService';
import { BlogPostClient } from './BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await BlogService.getPostBySlug(slug);

    if (!post || post.status !== 'published') {
      return { title: 'Post not found' };
    }

    const settings = await SettingsService.getSiteContent();
    const siteUrl = settings.seo?.siteUrl || '';
    const postUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/blogs/${post.slug}` : '';
    const siteTitle = settings.seo?.title || settings.profile?.fullName || 'Portfolio';
    const titleTemplate = settings.seo?.titleTemplate || '%s | Blog';

    const title = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', post.title)
      : `${post.title} | ${siteTitle}`;

    const description = post.summary || settings.seo?.description || `${post.title} — ${siteTitle}`;
    const ogImage = (post.seo as Record<string, unknown> | undefined)?.openGraphImage as
      string | undefined;

    const openGraphImages = ogImage ? [{ url: ogImage }] : undefined;

    return {
      title,
      description,
      alternates: postUrl ? { canonical: postUrl } : undefined,
      openGraph: {
        type: 'article',
        title: post.title,
        description,
        url: postUrl || undefined,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: openGraphImages,
      },
      twitter: {
        card: ogImage ? 'summary_large_image' : 'summary',
        title: post.title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return { title: 'Blog post' };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.blogs) {
    notFound();
  }

  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
