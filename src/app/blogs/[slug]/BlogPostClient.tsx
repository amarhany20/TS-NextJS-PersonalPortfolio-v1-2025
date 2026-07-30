'use client';

import { useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';

import { trackBlogPostView } from '@/utils/analytics';
import type { Blog } from '@/types/blog';

interface BlogPostClientProps {
  post: Blog;
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  useEffect(() => {
    trackBlogPostView(post.slug, post.title);
  }, [post.slug, post.title]);

  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <Link href="/blogs" className="text-sm text-[var(--accent-primary)] hover:underline">
          ← Back to all posts
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 rounded-full bg-[var(--accent-muted)] text-xs font-medium"
              >
                {category.name}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-semibold text-foreground">{post.title}</h1>
          {post.summary && (
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl">{post.summary}</p>
          )}
          <div className="text-sm text-[var(--text-secondary)] flex flex-wrap gap-3">
            <span>
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unpublished'}
            </span>
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </div>
      </div>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: buildContentMarkup(post.content) }}
      />

      {post.tags.length > 0 && (
        <footer className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
          {post.tags.map((tag) => (
            <span key={tag.id} className="px-2 py-1 rounded-full border border-[var(--border)]">
              #{tag.name}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}

function buildContentMarkup(content: string) {
  const trimmed = content?.trim();
  if (!trimmed) {
    return '<p class="text-[var(--text-secondary)]">No content yet.</p>';
  }

  const sanitized = DOMPurify.sanitize(trimmed, { USE_PROFILES: { html: true } }).trim();
  const containsTags = /<\/?[a-z][^>]*>/i.test(sanitized);

  if (sanitized && containsTags) {
    return sanitized;
  }

  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((paragraph) =>
      DOMPurify.sanitize(paragraph, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim(),
    )
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');

  return (
    paragraphs || `<p>${DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}</p>`
  );
}
