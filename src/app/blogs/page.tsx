import { BlogService } from '@/server/services/BlogService';
import { BlogListClient } from './BlogListClient';

/**
 * Blog index page.
 *
 * This server component loads published and draft-aware blog data through the service layer and
 * hands it to the client list renderer.
 */
export default async function BlogsPage() {
  const posts = await BlogService.listAllPosts();

  return <BlogListClient posts={posts} />;
}
