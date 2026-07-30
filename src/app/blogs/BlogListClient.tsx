'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { trackBlogListView } from '@/utils/analytics';
import type { BlogMeta } from '@/types/blog';

interface BlogListClientProps {
  posts: BlogMeta[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  useEffect(() => {
    trackBlogListView();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Thoughts, tutorials, and notes on building delightful developer experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 && (
          <p className="text-[var(--text-secondary)] text-sm col-span-full">
            No blog posts yet. Content coming soon.
          </p>
        )}

        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-wrap gap-2">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--text-secondary)] text-xs font-medium rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              {post.readingTime && (
                <span className="text-[var(--text-secondary)] text-sm">
                  {post.readingTime} min read
                </span>
              )}
            </div>

            <Link href={`/blogs/${post.slug}`} className="group block space-y-3">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-[var(--accent-primary)] transition-colors">
                {post.title}
              </h2>
              {post.summary && (
                <p className="text-[var(--text-secondary)] text-sm line-clamp-3">{post.summary}</p>
              )}
            </Link>

            <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>{formatPublishedDate(post.publishedAt)}</span>
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag.id} className="px-2 py-1 bg-[var(--accent-muted)] rounded-full">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatPublishedDate(value?: string) {
  if (!value) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  );
}
