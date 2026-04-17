'use client';

import Link from 'next/link';
import {
  useMemo,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { experienceCreateSchema, experienceUpdateSchema } from '@/client-validators/forms/experience';
import type { Experience } from '@/types/experience';
import { useToast } from '@/components/ui/ToastProvider';

interface ExperienceFormProps {
  mode: 'create' | 'edit';
  experience?: Experience | null;
}

type FormErrors = Record<string, string>;

const now = new Date();
const currentYearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

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

export function ExperienceForm({ mode, experience }: ExperienceFormProps) {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    company: experience?.company ?? '',
    title: experience?.title ?? '',
    location: experience?.location ?? '',
    start: experience?.start ?? currentYearMonth,
    end: experience?.end ?? '',
    present: experience?.present ?? false,
    impact: experience?.impact ?? '',
    achievementsInput: (experience?.achievements ?? []).join('\n'),
    skillsInput: (experience?.skills ?? []).join('\n'),
    companyUrl: experience?.companyUrl ?? '',
    displayOrder: experience?.displayOrder ? String(experience.displayOrder) : '',
    published: experience?.published ?? false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle = mode === 'create' ? 'Create experience' : `Edit experience at ${experience?.company ?? ''}`;
  const submitLabel = mode === 'create' ? 'Create experience' : 'Save changes';

  const derivedCounts = useMemo(() => {
    return {
      achievementCount: splitList(formState.achievementsInput).length,
      skillCount: splitList(formState.skillsInput).length,
    };
  }, [formState.achievementsInput, formState.skillsInput]);

  const handleInputChange = (
    field: keyof typeof formState,
    formatter?: (value: string) => string,
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = formatter ? formatter(event.target.value) : event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleCheckboxChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [field]: checked,
      ...(field === 'present' && checked ? { end: '' } : {}),
    }));
  };

  const buildPayload = () => {
    const achievements = splitList(formState.achievementsInput);
    const skills = splitList(formState.skillsInput);

    return {
      company: formState.company.trim(),
      title: formState.title.trim(),
      location: formState.location.trim() || undefined,
      start: formState.start,
      end: formState.present ? undefined : formState.end || undefined,
      present: formState.present,
      impact: formState.impact.trim() || undefined,
      achievements,
      skills,
      companyUrl: formState.companyUrl.trim() || undefined,
      displayOrder: formState.displayOrder ? Number(formState.displayOrder) : undefined,
      published: formState.published,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const payload = buildPayload();
    const schema = mode === 'create' ? experienceCreateSchema : experienceUpdateSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      setSubmitting(false);
      setError('Fix the highlighted fields and try again.');
      setFieldErrors(buildFieldErrors(result.error.issues));
      return;
    }

    const endpoint = mode === 'create' ? '/api/v1/experience' : experience ? `/api/v1/experience/${experience.id}` : null;
    if (!endpoint) {
      setSubmitting(false);
      setError('Experience context missing. Refresh and try again.');
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
        const message = payloadJson?.error?.message ?? 'Unable to save experience.';
        throw new Error(message);
      }

      setSuccess(mode === 'create' ? 'Experience created.' : 'Experience updated.');
      showToast({
        variant: 'success',
        title: mode === 'create' ? 'Experience created' : 'Experience updated',
        description: formState.company,
      });
      window.location.assign('/admin/experience');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save experience.';
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
        <p className="text-sm text-muted-foreground">Document milestones to power the home page timeline.</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-600 bg-amber-500/10 px-4 py-2 text-sm text-amber-700" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-lg border border-emerald-600 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600" aria-live="polite">
          {success}
        </p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Primary details</h2>
          <div className="space-y-4">
            <LabeledInput
              label="Company"
              required
              value={formState.company}
              onChange={handleInputChange('company')}
              error={fieldErrors.company}
            />
            <LabeledInput
              label="Title"
              required
              value={formState.title}
              onChange={handleInputChange('title')}
              error={fieldErrors.title}
            />
            <LabeledInput
              label="Location"
              value={formState.location}
              onChange={handleInputChange('location')}
              error={fieldErrors.location}
            />
            <TextareaField
              label="Impact summary"
              rows={3}
              value={formState.impact}
              onChange={handleInputChange('impact')}
              helper="Short highlight displayed in dashboard cards."
              error={fieldErrors.impact}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Timeline & status</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label="Start"
                type="month"
                required
                value={formState.start}
                onChange={handleInputChange('start')}
                error={fieldErrors.start}
              />
              <LabeledInput
                label="End"
                type="month"
                value={formState.end}
                onChange={handleInputChange('end')}
                disabled={formState.present}
                helper={formState.present ? 'Disabled while Present is checked' : 'Leave blank if ongoing'}
                error={fieldErrors.end}
              />
            </div>
            <div className="space-y-3 rounded-xl border border-dashed border-[var(--border)] p-4 text-sm">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={formState.present} onChange={handleCheckboxChange('present')} className="w-4 h-4" />
                <span>Present role</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={formState.published} onChange={handleCheckboxChange('published')} className="w-4 h-4" />
                <span>Published</span>
              </label>
              <p className="text-xs text-muted-foreground">Draft entries stay hidden from the public site.</p>
            </div>
            <LabeledInput
              label="Display order"
              type="number"
              min={0}
              value={formState.displayOrder}
              onChange={handleInputChange('displayOrder')}
              helper="Optional override for ordering"
            />
            <LabeledInput
              label="Company URL"
              type="url"
              value={formState.companyUrl ?? ''}
              onChange={handleInputChange('companyUrl')}
              error={fieldErrors.companyUrl}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Achievements</h2>
          <TextareaField
            label="Achievement bullets"
            rows={6}
            value={formState.achievementsInput}
            onChange={handleInputChange('achievementsInput')}
            helper={`${derivedCounts.achievementCount} bullet${derivedCounts.achievementCount === 1 ? '' : 's'} captured.`}
            error={fieldErrors.achievements}
          />
        </div>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Skills & stack</h2>
          <TextareaField
            label="Skills"
            rows={6}
            value={formState.skillsInput}
            onChange={handleInputChange('skillsInput')}
            helper={`${derivedCounts.skillCount} skill${derivedCounts.skillCount === 1 ? '' : 's'} highlighted.`}
            error={fieldErrors.skills}
          />
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 order-1 sm:order-none"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <Link
          href="/admin/experience"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent text-center sm:text-left order-2 sm:order-none"
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
