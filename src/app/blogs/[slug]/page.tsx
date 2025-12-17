import { notFound } from 'next/navigation';

import { BlogService } from '@/server/services/BlogService';
import { BlogPostClient } from './BlogPostClient';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await BlogService.getPostBySlug(params.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
