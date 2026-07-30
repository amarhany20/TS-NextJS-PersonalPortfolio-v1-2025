'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';

import type { Education } from '@/types/education';
import { useToast } from '@/components/ui/ToastProvider';

interface EducationManagerProps {
  initialEducation: Education[];
}

interface EducationListItem extends Education {
  displayOrder?: number;
}

/**
 * Manages education entries in the admin UI with client-side search, ordering,
 * refresh, and delete actions aligned to the current API response shape.
 */
export function EducationManager({ initialEducation }: EducationManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<EducationListItem[]>(initialEducation);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (
      items
        .slice()
        .sort((a, b) => {
          const aOrder = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.displayOrder ?? Number.MAX_SAFE_INTEGER;

          if (aOrder !== bOrder) return aOrder - bOrder;
          return (
            (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
            (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
          );
        })
        // Education items don't have published/draft status - all are visible
        .filter((item) => {
          if (!term) return true;
          return [item.institution, item.degree, item.field, item.location].some((field) =>
            field?.toString().toLowerCase().includes(term),
          );
        })
    );
  }, [items, search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/v1/education');
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const description = payload?.error?.message ?? 'Unable to refresh education records.';
        throw new Error(description);
      }

      const nextItems: EducationListItem[] = payload?.data?.education ?? [];
      setItems(nextItems);
      showToast({ variant: 'success', title: 'Education refreshed' });
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      showToast({ variant: 'error', title: 'Refresh failed', description });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (record: Education) => {
    if (!record.id) return;
    const confirmed = window.confirm(
      `Delete education record for ${record.institution}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusyId(record.id);
    try {
      const response = await fetch(`/api/v1/education/${record.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const description = payload?.error?.message ?? 'Unable to delete record.';
        throw new Error(description);
      }

      setItems((current) => current.filter((item) => item.id !== record.id));
      showToast({
        variant: 'success',
        title: 'Education deleted',
        description: record.institution,
      });
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Delete failed',
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Education</h1>
          <p className="text-sm text-muted-foreground">
            Keep academic history up to date for the public site.
          </p>
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
            href="/admin/education/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90"
          >
            <Plus size={16} />
            New education
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by institution, degree, or field"
          className="min-w-[240px] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-10 text-center">
          <p className="text-lg font-semibold text-foreground">No education records found</p>
          <p className="text-sm text-muted-foreground">
            Create a new education record to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30">
          <table className="w-full text-sm">
            <thead className="bg-[var(--card-bg)]/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Institution</th>
                <th className="px-4 py-3 text-left">Degree</th>
                <th className="px-4 py-3 text-left">Timeline</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-[var(--border)]/60">
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{item.institution}</p>
                      {item.location ? (
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="text-xs text-foreground">{item.degree}</p>
                      {item.field ? (
                        <p className="text-xs text-muted-foreground">{item.field}</p>
                      ) : null}
                      {item.gpa ? (
                        <p className="text-xs text-muted-foreground">GPA: {item.gpa}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                    {formatRange(item.start, item.end, item.present)}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      {item.displayOrder !== undefined ? (
                        <Badge variant="muted">Order #{item.displayOrder}</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <Link
                        href={`/admin/education/${item.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 font-medium text-muted-foreground transition hover:border-accent"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${item.institution}`}
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
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${classMap[variant]}`}
    >
      {children}
    </span>
  );
}

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' });

function formatRange(start?: string, end?: string, present?: boolean) {
  if (!start) return 'Unknown timeline';
  const startLabel = toMonthLabel(start);
  const endLabel = present || !end ? 'Present' : (toMonthLabel(end) ?? 'Unknown');
  return `${startLabel ?? 'Unknown'} — ${endLabel}`;
}

function toMonthLabel(value?: string) {
  if (!value || !/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return undefined;
  }
  const [year, month] = value.split('-').map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, (month ?? 1) - 1, 1)));
}
