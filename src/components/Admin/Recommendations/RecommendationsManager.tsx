'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';

import type { Recommendation } from '@/types/recommendation';
import { useToast } from '@/components/ui/ToastProvider';

interface RecommendationsManagerProps {
  initialRecommendations: Recommendation[];
}

type FilterValue = 'all' | 'published' | 'draft';

export function RecommendationsManager({ initialRecommendations }: RecommendationsManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<Recommendation[]>(initialRecommendations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');
  const [busyId, setBusyId] = useState<string | number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items
      .slice()
      .sort((a, b) => {
        const aOrder = (a as any).displayOrder ?? Number.MAX_SAFE_INTEGER;
        const bOrder = (b as any).displayOrder ?? Number.MAX_SAFE_INTEGER;

        if (aOrder !== bOrder) return aOrder - bOrder;
        return (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) - (a.updatedAt ? new Date(a.updatedAt).getTime() : 0);
      })
      .filter((item) => {
        const published = (item as any).published ?? false;
        if (filter === 'published') return published;
        if (filter === 'draft') return !published;
        return true;
      })
      .filter((item) => {
        if (!term) return true;
        return [item.name, item.position, item.company, item.relationship, item.content].some((field) =>
          field?.toString().toLowerCase().includes(term),
        );
      });
  }, [items, search, filter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/v1/recommendations');
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const description = payload?.error?.message ?? 'Unable to refresh recommendations.';
        throw new Error(description);
      }

      const nextItems: Recommendation[] = payload?.data?.recommendations ?? [];
      setItems(nextItems);
      showToast({ variant: 'success', title: 'Recommendations refreshed' });
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      showToast({ variant: 'error', title: 'Refresh failed', description });
    } finally {
      setRefreshing(false);
    }
  };

  const handleTogglePublish = async (record: Recommendation) => {
    const nextPublished = !((record as any).published ?? false);
    const id = record.id;
    if (!id) return;

    setBusyId(id);
    setItems((current) => current.map((item) => (item.id === id ? { ...item, published: nextPublished } as any : item)));

    try {
      const response = await fetch(`/api/v1/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const description = payload?.error?.message ?? 'Unable to update recommendation.';
        throw new Error(description);
      }

      const updated: Recommendation = payload?.data?.recommendation ?? { ...record, published: nextPublished } as any;
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      showToast({
        variant: 'success',
        title: nextPublished ? 'Recommendation published' : 'Recommendation moved to draft',
        description: record.name,
      });
    } catch (error) {
      setItems((current) => current.map((item) => (item.id === id ? { ...item, published: (record as any).published } as any : item)));
      showToast({ variant: 'error', title: 'Update failed', description: error instanceof Error ? error.message : undefined });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (record: Recommendation) => {
    if (!record.id) return;
    const confirmed = window.confirm(`Delete recommendation from ${record.name}? This cannot be undone.`);
    if (!confirmed) return;

    setBusyId(record.id);
    try {
      const response = await fetch(`/api/v1/recommendations/${record.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const description = payload?.error?.message ?? 'Unable to delete recommendation.';
        throw new Error(description);
      }

      setItems((current) => current.filter((item) => item.id !== record.id));
      showToast({ variant: 'success', title: 'Recommendation deleted', description: record.name });
    } catch (error) {
      showToast({ variant: 'error', title: 'Delete failed', description: error instanceof Error ? error.message : undefined });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Collect and curate recommendations displayed on the home page.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            href="/admin/recommendations/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90"
          >
            <Plus size={16} />
            New recommendation
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, position, company, or content"
          className="min-w-[240px] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1 text-xs">
          {(['all', 'published', 'draft'] as FilterValue[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-full px-3 py-1 font-medium capitalize transition ${
                filter === option ? 'bg-[var(--accent-primary)] text-black' : 'text-muted-foreground'
              }`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-10 text-center">
          <p className="text-lg font-semibold text-foreground">No recommendations found</p>
          <p className="text-sm text-muted-foreground">Create a new recommendation to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30">
          <table className="w-full text-sm">
            <thead className="bg-[var(--card-bg)]/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Content preview</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-[var(--border)]/60">
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      {item.company ? (
                        <p className="text-xs text-muted-foreground">{item.company}</p>
                      ) : null}
                      {item.relationship ? (
                        <p className="text-xs text-muted-foreground">{item.relationship}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                    {item.position || item.title || '—'}
                  </td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                    <div className="max-w-md">
                      {item.content ? (
                        <p className="line-clamp-2">{item.content}</p>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <Badge variant={(item as any).published ? 'success' : 'warning'}>
                        {(item as any).published ? 'Published' : 'Draft'}
                      </Badge>
                      {(item as any).displayOrder !== undefined ? (
                        <Badge variant="muted">Order #{(item as any).displayOrder}</Badge>
                      ) : null}
                      {item.rating ? (
                        <Badge variant="muted">{item.rating}/5 ⭐</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <button
                        type="button"
                        aria-label={`${(item as any).published ? 'Unpublish' : 'Publish'} ${item.name}`}
                        onClick={() => handleTogglePublish(item)}
                        disabled={busyId === item.id}
                        className="rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {(item as any).published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/recommendations/${item.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => handleDelete(item)}
                        disabled={busyId === item.id}
                        className="rounded-lg border border-[var(--border)] px-2 py-1 text-muted-foreground transition hover:border-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'muted';
}

function Badge({ children, variant = 'muted' }: BadgeProps) {
  const classMap: Record<Required<BadgeProps>['variant'], string> = {
    success: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40',
    warning: 'bg-amber-500/15 text-amber-600 border-amber-500/40',
    muted: 'bg-[var(--border)]/30 text-muted-foreground border-[var(--border)]/50',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${classMap[variant]}`}>
      {children}
    </span>
  );
}

