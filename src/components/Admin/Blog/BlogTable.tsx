"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { Blog, BlogStatus } from '@/types/blog';

interface BlogTableProps {
  posts: Blog[];
}

const STATUS_FILTERS: Array<{ label: string; value: BlogStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export function BlogTable({ posts }: BlogTableProps) {
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') {
      return posts;
    }

    return posts.filter((post) => post.status === statusFilter);
  }, [posts, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === filter.value
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--text-secondary)]">
              <th className="py-2 font-semibold">Title</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold">Categories</th>
              <th className="py-2 font-semibold">Tags</th>
              <th className="py-2 font-semibold">Published</th>
              <th className="py-2 font-semibold">Updated</th>
              <th className="py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-[var(--text-secondary)]">
                  No posts match this filter yet.
                </td>
              </tr>
            )}

            {filtered.map((post) => (
              <tr key={post.id} className="border-t border-[var(--border)]/60">
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{post.title}</span>
                    {post.summary && <span className="text-xs text-[var(--text-secondary)] line-clamp-1">{post.summary}</span>}
                  </div>
                </td>
                <td className="py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="py-3">
                  <InlineList items={post.categories.map((category) => category.name)} emptyLabel="None" />
                </td>
                <td className="py-3">
                  <InlineList items={post.tags.map((tag) => `#${tag.name}`)} emptyLabel="None" />
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-3 text-xs">
                    <Link
                      href={`/admin/blogs/${post.slug}`}
                      className="font-semibold text-[var(--accent-primary)] hover:underline"
                    >
                      Edit
                    </Link>
                    <Link href={`/blogs/${post.slug}`} className="text-[var(--text-secondary)] hover:underline" prefetch={false}>
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BlogStatus }) {
  const styles: Record<BlogStatus, string> = {
    draft: 'bg-[var(--accent-muted)] text-[var(--text-secondary)]',
    scheduled: 'bg-amber-100 text-amber-900',
    published: 'bg-emerald-100 text-emerald-900',
    archived: 'bg-gray-200 text-gray-600',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InlineList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (!items.length) {
    return <span className="text-xs text-[var(--text-secondary)]">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-[var(--accent-muted)] px-2 py-0.5">
          {item}
        </span>
      ))}
    </div>
  );
}
