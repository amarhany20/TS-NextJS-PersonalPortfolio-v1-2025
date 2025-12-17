'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';

import type { Certificate } from '@/types/certificate';
import { useToast } from '@/components/ui/ToastProvider';

interface CertificatesManagerProps {
  initialCertificates: Certificate[];
}

export function CertificatesManager({ initialCertificates }: CertificatesManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<Certificate[]>(initialCertificates);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
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
        if (!term) return true;
        return [item.name, item.issuer, item.credential, item.description].some((field) =>
          field?.toString().toLowerCase().includes(term),
        );
      });
  }, [items, search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/v1/certificates');
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const description = payload?.error?.message ?? 'Unable to refresh certificates.';
        throw new Error(description);
      }

      const nextItems: Certificate[] = payload?.data?.certificates ?? [];
      setItems(nextItems);
      showToast({ variant: 'success', title: 'Certificates refreshed' });
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      showToast({ variant: 'error', title: 'Refresh failed', description });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (record: Certificate) => {
    if (!record.id) return;
    const confirmed = window.confirm(`Delete certificate "${record.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setBusyId(record.id);
    try {
      const response = await fetch(`/api/v1/certificates/${record.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const description = payload?.error?.message ?? 'Unable to delete certificate.';
        throw new Error(description);
      }

      setItems((current) => current.filter((item) => item.id !== record.id));
      showToast({ variant: 'success', title: 'Certificate deleted', description: record.name });
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
          <h1 className="text-3xl font-semibold">Certificates</h1>
          <p className="text-sm text-muted-foreground">Manage professional certifications and verification links.</p>
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
            href="/admin/certificates/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90"
          >
            <Plus size={16} />
            New certificate
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, issuer, or credential"
          className="min-w-[240px] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-10 text-center">
          <p className="text-lg font-semibold text-foreground">No certificates found</p>
          <p className="text-sm text-muted-foreground">Create a new certificate to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30">
          <table className="w-full text-sm">
            <thead className="bg-[var(--card-bg)]/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Issuer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Skills</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-[var(--border)]/60">
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      {item.credential ? (
                        <p className="text-xs text-muted-foreground">ID: {item.credential}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">{item.issuer}</td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-4 align-top text-xs text-muted-foreground">
                    {item.skills && item.skills.length > 0 ? (
                      <Badge variant="muted">{item.skills.length} skill{item.skills.length !== 1 ? 's' : ''}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <Link
                        href={`/admin/certificates/${item.id}`}
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

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  } catch {
    return 'Invalid date';
  }
}

