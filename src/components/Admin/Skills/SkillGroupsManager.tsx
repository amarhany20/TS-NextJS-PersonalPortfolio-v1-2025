'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';

import { useToast } from '@/components/ui/ToastProvider';
import type { SkillGroupDisplay } from '@/types/skill';

interface SkillGroupsManagerProps {
  initialSkillGroups: SkillGroupDisplay[];
}

export function SkillGroupsManager({ initialSkillGroups }: SkillGroupsManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [items, setItems] = useState<SkillGroupDisplay[]>(initialSkillGroups);
  const [search, setSearch] = useState('');
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items
      .slice()
      .sort((a, b) => {
        const aOrder = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.title.localeCompare(b.title);
      })
      .filter((group) => {
        if (!term) return true;
        const skills = group.skills?.map((s) => s.name).join(' ') ?? '';
        return [group.title, group.id, group.summary ?? '', skills].some((field) =>
          field.toLowerCase().includes(term),
        );
      });
  }, [items, search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/v1/skills');
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const description = payload?.error?.message ?? 'Unable to refresh skill groups.';
        throw new Error(description);
      }

      const nextItems: SkillGroupDisplay[] = payload?.data?.skillGroups ?? [];
      setItems(nextItems);
      showToast({ variant: 'success', title: 'Skills refreshed' });
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      showToast({ variant: 'error', title: 'Refresh failed', description });
    } finally {
      setRefreshing(false);
    }
  };

  const handleTogglePublish = async (group: SkillGroupDisplay) => {
    const nextPublished = !(group.published ?? false);
    const slug = group.id;

    setBusySlug(slug);
    setItems((current) => current.map((item) => (item.id === slug ? { ...item, published: nextPublished } : item)));

    try {
      const response = await fetch(`/api/v1/skills/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const description = payload?.error?.message ?? 'Unable to update skill group.';
        throw new Error(description);
      }

      const updated: SkillGroupDisplay = payload?.data?.skillGroup ?? { ...group, published: nextPublished };
      setItems((current) => current.map((item) => (item.id === slug ? { ...item, ...updated } : item)));
      showToast({
        variant: 'success',
        title: nextPublished ? 'Skill group published' : 'Skill group moved to draft',
        description: group.title,
      });
    } catch (error) {
      setItems((current) => current.map((item) => (item.id === slug ? { ...item, published: group.published } : item)));
      showToast({ variant: 'error', title: 'Update failed', description: error instanceof Error ? error.message : undefined });
    } finally {
      setBusySlug(null);
    }
  };

  const handleDelete = async (group: SkillGroupDisplay) => {
    const slug = group.id;
    const confirmed = window.confirm(`Delete skill group "${group.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setBusySlug(slug);
    try {
      const response = await fetch(`/api/v1/skills/${slug}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const description = payload?.error?.message ?? 'Unable to delete skill group.';
        throw new Error(description);
      }

      setItems((current) => current.filter((item) => item.id !== slug));
      showToast({ variant: 'success', title: 'Skill group deleted', description: group.title });
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      showToast({ variant: 'error', title: 'Delete failed', description });
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Skills</h1>
          <p className="text-sm text-muted-foreground">Organise skill groups and keep the stack representation current.</p>
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
            href="/admin/skills/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90"
          >
            <Plus size={16} />
            New group
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search groups or skills"
          className="min-w-[240px] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-10 text-center">
          <p className="text-lg font-semibold text-foreground">No skill groups found</p>
          <p className="text-sm text-muted-foreground">Create a new group to populate the skills section.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30">
          <table className="w-full text-sm">
            <thead className="bg-[var(--card-bg)]/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Group</th>
                <th className="px-4 py-3 text-left">Summary</th>
                <th className="px-4 py-3 text-left">Skills</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group) => (
                <tr key={group.id} className="border-t border-[var(--border)]/60">
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{group.title}</p>
                      <p className="text-xs text-muted-foreground">/{group.id}</p>
                      {group.displayOrder !== undefined ? (
                        <p className="text-xs text-muted-foreground">Order #{group.displayOrder}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">{group.summary ?? '—'}</td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                    {(group.skills ?? []).slice(0, 10).map((skill) => skill.name).join(', ') || '—'}
                    {(group.skills?.length ?? 0) > 10 ? (
                      <span className="text-muted-foreground"> …</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <Badge variant={group.published ? 'success' : 'warning'}>
                        {group.published ? 'Published' : 'Draft'}
                      </Badge>
                      {group.displayOrder !== undefined ? (
                        <Badge variant="muted">Order #{group.displayOrder}</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <button
                        type="button"
                        aria-label={`${group.published ? 'Unpublish' : 'Publish'} ${group.title}`}
                        onClick={() => handleTogglePublish(group)}
                        disabled={busySlug === group.id}
                        className="rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {group.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/skills/${group.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${group.title}`}
                        onClick={() => handleDelete(group)}
                        disabled={busySlug === group.id}
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
