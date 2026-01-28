'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Archive, CheckCircle2, Loader2, MailOpen, Trash2 } from 'lucide-react';

import {
  CONTACT_SUBMISSION_STATUSES,
  type ContactSubmission,
  type ContactSubmissionStatus,
} from '@/types/contact';

interface ContactInboxProps {
  initialSubmissions: ContactSubmission[];
}

const STATUS_BADGES: Record<ContactSubmissionStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-emerald-500/15 text-emerald-600' },
  in_progress: { label: 'In progress', className: 'bg-amber-500/15 text-amber-600' },
  resolved: { label: 'Resolved', className: 'bg-sky-500/15 text-sky-600' },
  archived: { label: 'Archived', className: 'bg-slate-500/15 text-slate-600' },
};

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));


export function ContactInbox({ initialSubmissions }: ContactInboxProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [statusFilter, setStatusFilter] = useState<'all' | ContactSubmissionStatus>('all');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') {
      return submissions;
    }
    return submissions.filter((submission) => submission.status === statusFilter);
  }, [submissions, statusFilter]);

  const stats = useMemo(() => {
    return CONTACT_SUBMISSION_STATUSES.reduce(
      (acc, status) => {
        acc[status] = submissions.filter((submission) => submission.status === status).length;
        return acc;
      },
      {} as Record<ContactSubmissionStatus, number>,
    );
  }, [submissions]);

  const handleStatusChange = async (id: string, status: ContactSubmissionStatus) => {
    setMessage(null);
    setError(null);
    setPendingId(id);

    const previous = submissions;
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === id ? { ...submission, status } : submission,
      ),
    );

    try {
      const response = await fetch(`/api/v1/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw await deriveError(response);
      }

      setMessage('Status updated.');
    } catch (err) {
      setSubmissions(previous);
      setError(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this submission? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    setMessage(null);
    setError(null);
    setPendingId(id);

    try {
      const response = await fetch(`/api/v1/contact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw await deriveError(response);
      }

      setSubmissions((current) => current.filter((submission) => submission.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      setMessage('Submission deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_SUBMISSION_STATUSES.map((status) => (
          <div key={status} className="space-y-1">
            <p className="text-xs uppercase text-muted-foreground">{STATUS_BADGES[status].label}</p>
            <p className="text-2xl font-semibold">{stats[status] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        {CONTACT_SUBMISSION_STATUSES.map((status) => (
          <FilterChip
            key={status}
            label={STATUS_BADGES[status].label}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          />
        ))}
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

      {filteredSubmissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-8 text-center text-sm text-muted-foreground">
          No submissions found for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{submission.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {submission.email}
                    {submission.phone ? ` · ${submission.phone}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(submission.createdAt)}
                  </p>

                </div>
                <span
                  className={`${STATUS_BADGES[submission.status].className} rounded-full px-3 py-1 text-xs font-medium`}
                >
                  {STATUS_BADGES[submission.status].label}
                </span>
              </div>

              {submission.subject ? (
                <p className="mt-3 text-sm font-medium">{submission.subject}</p>
              ) : null}
              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                {submission.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-accent"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  View message
                </button>
                {submission.status !== 'in_progress' && (
                  <ActionButton
                    icon={<MailOpen size={14} />}
                    label="Mark in progress"
                    onClick={() => handleStatusChange(submission.id, 'in_progress')}
                    disabled={pendingId === submission.id}
                  />
                )}
                {submission.status !== 'resolved' && (
                  <ActionButton
                    icon={<CheckCircle2 size={14} />}
                    label="Mark resolved"
                    onClick={() => handleStatusChange(submission.id, 'resolved')}
                    disabled={pendingId === submission.id}
                  />
                )}
                {submission.status !== 'archived' && (
                  <ActionButton
                    icon={<Archive size={14} />}
                    label="Archive"
                    onClick={() => handleStatusChange(submission.id, 'archived')}
                    disabled={pendingId === submission.id}
                  />
                )}
                <ActionButton
                  icon={<Trash2 size={14} />}
                  label="Delete"
                  destructive
                  onClick={() => handleDelete(submission.id)}
                  disabled={pendingId === submission.id}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedSubmission ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="max-h-full w-full max-w-3xl overflow-hidden rounded-2xl bg-[var(--background)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{selectedSubmission.name}</p>
                <p className="text-xs text-muted-foreground">{selectedSubmission.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-muted-foreground"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-5">
              {selectedSubmission.subject ? (
                <p className="text-sm font-semibold">{selectedSubmission.subject}</p>
              ) : null}
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {selectedSubmission.message}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? 'bg-[var(--accent-primary)] text-black shadow'
          : 'border border-[var(--border)] text-muted-foreground hover:border-accent'
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  destructive,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        destructive
          ? 'border-red-300 text-red-600 hover:border-red-400'
          : 'border-[var(--border)] text-muted-foreground hover:border-accent'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      {disabled ? <Loader2 size={14} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}

async function deriveError(response: Response) {
  const payload = await response.json().catch(() => null);
  const message = payload?.error?.message ?? 'Request failed.';
  return new Error(message);
}
