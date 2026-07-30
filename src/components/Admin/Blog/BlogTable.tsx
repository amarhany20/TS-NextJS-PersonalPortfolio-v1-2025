'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { Blog, BlogStatus } from '@/types/blog';
import { useToast } from '@/components/ui/ToastProvider';

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

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleDateString('en-US', { timeZone: 'UTC' });
};

export function BlogTable({ posts }: BlogTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');
  const [rows, setRows] = useState<Blog[]>(posts);

  useEffect(() => {
    setRows(posts);
  }, [posts]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') {
      return rows;
    }

    return rows.filter((post) => post.status === statusFilter);
  }, [rows, statusFilter]);

  const handleDelete = async (post: Blog) => {
    const confirmed = window.confirm(`Delete "${post.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/blogs/${post.slug}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message = payload?.error?.message ?? 'Unable to delete blog post.';
        throw new Error(message);
      }

      setRows((current) => current.filter((item) => item.id !== post.id));
      showToast({ variant: 'success', title: 'Blog post deleted', description: post.title });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete blog post.';
      showToast({ variant: 'error', title: 'Delete failed', description: message });
    }
  };

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
                    {post.summary && (
                      <span className="text-xs text-[var(--text-secondary)] line-clamp-1">
                        {post.summary}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="py-3">
                  <InlineList
                    items={post.categories.map((category) => category.name)}
                    emptyLabel="None"
                  />
                </td>
                <td className="py-3">
                  <InlineList items={post.tags.map((tag) => `#${tag.name}`)} emptyLabel="None" />
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {formatDate(post.publishedAt)}
                </td>
                <td className="py-3 text-[var(--text-secondary)]">{formatDate(post.updatedAt)}</td>

                <td className="py-3 text-right">
                  <div className="flex justify-end gap-3 text-xs">
                    <Link
                      href={`/admin/blogs/${post.slug}`}
                      className="font-semibold text-[var(--accent-primary)] hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="text-[var(--text-secondary)] hover:underline"
                      prefetch={false}
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      className="font-semibold text-rose-500 hover:underline"
                    >
                      Delete
                    </button>
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
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? styles.draft}`}
    >
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
