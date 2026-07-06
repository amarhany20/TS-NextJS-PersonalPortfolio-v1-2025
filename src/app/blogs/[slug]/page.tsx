import { notFound } from 'next/navigation';

import { BlogService } from '@/server/services/BlogService';
import { SettingsService } from '@/server/services/SettingsService';
import { BlogPostClient } from './BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
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
