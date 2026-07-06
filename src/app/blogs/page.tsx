import { notFound } from 'next/navigation';

import { BlogService } from '@/server/services/BlogService';
import { SettingsService } from '@/server/services/SettingsService';
import { BlogListClient } from './BlogListClient';

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
