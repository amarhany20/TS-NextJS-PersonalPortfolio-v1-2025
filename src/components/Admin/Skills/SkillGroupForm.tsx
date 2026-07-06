'use client';

import Link from 'next/link';
import {
  useEffect,
  useMemo,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { useToast } from '@/components/ui/ToastProvider';
import {
  skillGroupCreateSchema,
  skillGroupUpdateSchema,
} from '@/client-validators/forms/skills';
import type { SkillGroupDisplay } from '@/types/skill';

interface SkillGroupFormProps {
  mode: 'create' | 'edit';
  group?: SkillGroupDisplay | null;
}

type FormErrors = Record<string, string>;

const splitList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const buildFieldErrors = (issues: Array<{ path: PropertyKey[]; message: string }>): FormErrors => {
  const map: FormErrors = {};
  for (const issue of issues) {
    const rawKey = issue.path[0];
    const key = typeof rawKey === 'string' || typeof rawKey === 'number' ? rawKey.toString() : 'form';
    if (!map[key]) {
      map[key] = issue.message;
    }
  }
  return map;
};

export function SkillGroupForm({ mode, group }: SkillGroupFormProps) {
  const { showToast } = useToast();
  const [hydrated, setHydrated] = useState(false);

  const [formState, setFormState] = useState({
    slug: group?.id ?? '',
    title: group?.title ?? '',
    summary: group?.summary ?? '',
    displayOrder: group?.displayOrder !== undefined ? String(group.displayOrder) : '',
    skillsInput: (group?.skills ?? []).map((s) => s.name).join('\n'),
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle = mode === 'create' ? 'Create skill group' : `Edit skill group: ${group?.title ?? ''}`;
  const submitLabel = mode === 'create' ? 'Create group' : 'Save changes';

  useEffect(() => {
    setHydrated(true);
  }, []);

  const derived = useMemo(() => {
    return {
      skillCount: splitList(formState.skillsInput).length,
    };
  }, [formState.skillsInput]);

  const handleInputChange = (field: keyof typeof formState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const buildPayload = () => {
    const skills = splitList(formState.skillsInput).map((name, index) => ({
      name,
      displayOrder: index,
    }));

    const slugTrimmed = formState.slug.trim();

    return {
      ...(slugTrimmed ? { slug: slugTrimmed } : {}),
      title: formState.title.trim(),
      summary: formState.summary.trim() || undefined,
      displayOrder: formState.displayOrder ? Number(formState.displayOrder) : undefined,
      skills,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const payload = buildPayload();
    const schema = mode === 'create' ? skillGroupCreateSchema : skillGroupUpdateSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      setSubmitting(false);
      setError('Fix the highlighted fields and try again.');
      setFieldErrors(buildFieldErrors(result.error.issues));
      return;
    }

    const endpoint = mode === 'create' ? '/api/v1/skills' : group ? `/api/v1/skills/${group.id}` : null;
    if (!endpoint) {
      setSubmitting(false);
      setError('Skill group context missing. Refresh and try again.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const payloadJson = await response.json().catch(() => null);
      if (!response.ok) {
        const message = payloadJson?.error?.message ?? 'Unable to save skill group.';
        throw new Error(message);
      }

      showToast({
        variant: 'success',
        title: mode === 'create' ? 'Skill group created' : 'Skill group updated',
      });

      window.location.assign('/admin/skills');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save skill group.';
      setError(message);
      showToast({ variant: 'error', title: 'Save failed', description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground">Skill groups power the public skills section and sidebar badges.</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-600 bg-amber-500/10 px-4 py-2 text-sm text-amber-700" role="alert">
          {error}
        </p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Group details</h2>
          <div className="space-y-4">
            <LabeledInput
              label="Title"
              required
              value={formState.title}
              onChange={handleInputChange('title')}
              error={fieldErrors.title}
            />
            <LabeledInput
              label="Slug"
              value={formState.slug}
              onChange={handleInputChange('slug')}
              helper={mode === 'create' ? 'Leave blank to auto-generate from title.' : 'Changing slug updates the URL.'}
              error={fieldErrors.slug}
            />
            <LabeledInput
              label="Display order"
              type="number"
              min={0}
              value={formState.displayOrder}
              onChange={handleInputChange('displayOrder')}
              helper="Lower numbers appear first."
              error={fieldErrors.displayOrder}
            />
            <TextareaField
              label="Summary"
              rows={3}
              value={formState.summary}
              onChange={handleInputChange('summary')}
              helper="Optional short description shown under the group title."
              error={fieldErrors.summary}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-5">
          <h2 className="text-lg font-semibold">Skills</h2>
          <TextareaField
            label="Skill names"
            rows={12}
            value={formState.skillsInput}
            onChange={handleInputChange('skillsInput')}
            helper={`${derived.skillCount} skill${derived.skillCount === 1 ? '' : 's'} captured. One per line.`}
            error={fieldErrors.skills}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!hydrated || submitting}
        >
          {!hydrated ? 'Loading…' : submitting ? 'Saving…' : submitLabel}
        </button>
        <Link
          href="/admin/skills"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function LabeledInput({ label, helper, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; helper?: string; error?: string }) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1 text-sm font-medium text-foreground">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        {...props}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
          error ? 'border-amber-500 focus:border-amber-500' : 'border-[var(--border)] bg-transparent focus:border-accent'
        } ${props.className ?? ''}`}
      />
      {helper ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
      {error ? <p id={errorId} className="text-xs text-amber-600">{error}</p> : null}
    </div>
  );
}

function TextareaField({ label, helper, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; helper?: string; error?: string }) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1 text-sm font-medium text-foreground">
      <label htmlFor={inputId}>{label}</label>
      <textarea
        id={inputId}
        {...props}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
          error ? 'border-amber-500 focus:border-amber-500' : 'border-[var(--border)] bg-transparent focus:border-accent'
        } ${props.className ?? ''}`}
      />
      {helper ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
      {error ? <p id={errorId} className="text-xs text-amber-600">{error}</p> : null}
    </div>
  );
}
