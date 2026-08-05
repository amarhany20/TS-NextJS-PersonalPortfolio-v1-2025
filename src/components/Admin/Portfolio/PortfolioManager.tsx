'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';

import type { Project } from '@/types/portfolio';
import { PortfolioReorderBoard } from './PortfolioReorderBoard';
import { useToast } from '@/components/ui/ToastProvider';
import { adminError } from '@/utils/admin';

interface PortfolioManagerProps {
  initialProjects: Project[];
}

export function PortfolioManager({ initialProjects }: PortfolioManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects
      .slice()
      .sort((a, b) => {
        const aOrder = a.displayOrder ?? 0;
        const bOrder = b.displayOrder ?? 0;
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
      .filter((project) => {
        if (!term) return true;
        return [project.title, project.slug, project.intro, project.summary].some((field) =>
          field?.toLowerCase().includes(term),
        );
      });
  }, [projects, search]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleOrderSaved = (ordered: Project[]) => {
    setProjects(ordered);
    setMessage('Order updated.');
    showToast({
      variant: 'success',
      title: 'Order updated',
      description: 'Portfolio order synced.',
    });
    router.refresh();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/v1/portfolio');
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(await adminError(response));
      }
      const nextProjects: Project[] = payload?.data?.projects ?? [];
      setProjects(nextProjects);
      setMessage('List refreshed.');
      showToast({ variant: 'success', title: 'Projects refreshed' });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to refresh projects.');
      showToast({
        variant: 'error',
        title: 'Refresh failed',
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const nextPublished = !project.published;
    setBusySlug(project.slug);
    setError(null);
    setMessage(null);

    setProjects((current) =>
      current.map((item) =>
        item.slug === project.slug ? { ...item, published: nextPublished } : item,
      ),
    );

    try {
      const response = await fetch(`/api/v1/portfolio/${project.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(await adminError(response));
      }
      const updated: Project = payload?.data?.project ?? { ...project, published: nextPublished };
      setProjects((current) =>
        current.map((item) => (item.slug === project.slug ? { ...item, ...updated } : item)),
      );
      setMessage(nextPublished ? 'Project published.' : 'Project moved to draft.');
      showToast({
        variant: 'success',
        title: nextPublished ? 'Project published' : 'Project moved to draft',
        description: project.title,
      });
    } catch (err) {
      setProjects((current) =>
        current.map((item) =>
          item.slug === project.slug ? { ...item, published: project.published } : item,
        ),
      );
      setError(err instanceof Error ? err.message : 'Unable to update project.');
      showToast({
        variant: 'error',
        title: 'Failed to update project',
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setBusySlug(null);
    }
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(`Delete ${project.title}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setBusySlug(project.slug);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/v1/portfolio/${project.slug}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(await adminError(response));
      }
      setProjects((current) => current.filter((item) => item.slug !== project.slug));
      setMessage('Project deleted.');
      showToast({ variant: 'success', title: 'Project deleted', description: project.title });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete project.');
      showToast({
        variant: 'error',
        title: 'Delete failed',
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Manage case studies, publish drafts, and keep ordering tidy.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden xs:inline">Refresh</span>
          </button>
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 sm:px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90"
          >
            <Plus size={16} />
            <span className="hidden xs:inline">New project</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, slug, or summary"
          className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <p className="text-xs text-muted-foreground sm:whitespace-nowrap">
          Showing {filtered.length} of {projects.length} project{projects.length === 1 ? '' : 's'}
        </p>
      </div>

      {message ? (
        <p className="text-sm text-emerald-600" aria-live="polite">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-amber-600" role="alert">
          {error}
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-6 sm:p-10 text-center">
          <p className="text-lg font-semibold text-foreground">No projects match that filter</p>
          <p className="text-sm text-muted-foreground">
            Try a different search term or create a new case study.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30">
            <table className="w-full text-sm">
              <thead className="bg-[var(--card-bg)]/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Project</th>
                  <th className="px-4 py-3 text-left">Timeline</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Stack</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.slug} className="border-t border-[var(--border)]/60">
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{project.title}</span>
                          {project.featured ? <Badge variant="accent">Featured</Badge> : null}
                        </div>
                        <p className="text-xs text-muted-foreground">/{project.slug}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {project.tagline}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                      <p>{formatRange(project.start, project.end)}</p>
                      <p>Updated {formatShortDate(project.updatedAt)}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-1 text-xs">
                        <Badge variant={project.published ? 'success' : 'warning'}>
                          {project.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="muted">{project.status}</Badge>
                        <Badge variant={project.visibility === 'public' ? 'muted' : 'warning'}>
                          {project.visibility}
                        </Badge>
                        <Badge variant="muted">{project.access}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                      <div className="flex flex-wrap gap-1">
                        {(project.stack ?? []).slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-[var(--border)]/40 px-2 py-0.5 text-[10px] uppercase tracking-wide"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          type="button"
                          aria-label={`${project.published ? 'Unpublish' : 'Publish'} ${project.title}`}
                          onClick={() => handleTogglePublish(project)}
                          disabled={busySlug === project.slug}
                          className="rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {project.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link
                          href={`/admin/portfolio/${project.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent"
                        >
                          <Pencil size={14} /> Edit
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${project.title}`}
                          onClick={() => handleDelete(project)}
                          disabled={busySlug === project.slug}
                          className="rounded-lg border border-[var(--border)] px-2 py-1 text-muted-foreground transition hover:border-amber-500 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filtered.map((project) => (
              <div
                key={project.slug}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground truncate">
                        {project.title}
                      </span>
                      {project.featured ? <Badge variant="accent">Featured</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">/{project.slug}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {project.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatRange(project.start, project.end)}</span>
                  <span>•</span>
                  <span>Updated {formatShortDate(project.updatedAt)}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant={project.published ? 'success' : 'warning'}>
                    {project.published ? 'Published' : 'Draft'}
                  </Badge>
                  <Badge variant="muted">{project.status}</Badge>
                  <Badge variant={project.visibility === 'public' ? 'muted' : 'warning'}>
                    {project.visibility}
                  </Badge>
                  <Badge variant="muted">{project.access}</Badge>
                </div>

                {(project.stack ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(project.stack ?? []).slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-[var(--border)]/40 px-2 py-0.5 text-[10px] uppercase tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]/60">
                  <button
                    type="button"
                    aria-label={`${project.published ? 'Unpublish' : 'Publish'} ${project.title}`}
                    onClick={() => handleTogglePublish(project)}
                    disabled={busySlug === project.slug}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {project.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link
                    href={`/admin/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-accent"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${project.title}`}
                    onClick={() => handleDelete(project)}
                    disabled={busySlug === project.slug}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-amber-500 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {projects.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-6">
          <PortfolioReorderBoard projects={projects} onOrderSaved={handleOrderSaved} />
        </div>
      ) : null}
    </section>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'accent' | 'warning' | 'success' | 'muted';
}

function Badge({ children, variant = 'muted' }: BadgeProps) {
  const classMap: Record<Required<BadgeProps>['variant'], string> = {
    accent:
      'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30',
    warning: 'bg-amber-500/15 text-amber-600 border-amber-600/40',
    success: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40',
    muted: 'bg-[var(--border)]/30 text-muted-foreground border-[var(--border)]/60',
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${classMap[variant]}`}
    >
      {children}
    </span>
  );
}

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const formatShortDate = (value: string) => shortDateFormatter.format(new Date(value));

const formatRange = (start?: string, end?: string) => {
  const startLabel = formatYearMonth(start);
  const endLabel = end ? formatYearMonth(end) : 'Present';
  return `${startLabel ?? 'Unknown'} — ${endLabel}`;
};

const formatYearMonth = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return undefined;
  }
  const [year, month] = value.split('-').map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, (month ?? 1) - 1, 1)));
};
