import Link from 'next/link';

import { BlogService } from '@/server/services/BlogService';
import { BlogListClient } from './BlogListClient';

export default async function BlogsPage() {
  const posts = await BlogService.listAllPosts();

  return <BlogListClient posts={posts} />;
}

function formatPublishedDate(value?: string) {
  if (!value) {
    return 'Unpublished';
  }

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
