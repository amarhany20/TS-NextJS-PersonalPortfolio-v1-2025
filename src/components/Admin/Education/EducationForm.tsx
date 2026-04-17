'use client';

import Link from 'next/link';
import {
  useMemo,
  useState,
  useId,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import { createEducationSchema, updateEducationSchema } from '@/server/server-validators/api/education';
import type { Education } from '@/types/education';
import { useToast } from '@/components/ui/ToastProvider';

interface EducationFormProps {
  mode: 'create' | 'edit';
  education?: Education | null;
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

export function EducationForm({ mode, education }: EducationFormProps) {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    institution: education?.institution ?? '',
    degree: education?.degree ?? '',
    field: education?.field ?? '',
    location: education?.location ?? '',
    start: education?.start ?? currentYearMonth,
    end: education?.end ?? '',
    present: education?.present ?? false,
    gpa: education?.gpa ?? '',
    achievementsInput: (education?.achievements ?? []).join('\n'),
    project: education?.project ?? '',
    // published: education?.published ?? true, // Education doesn't have published field
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle = mode === 'create' ? 'Create education' : `Edit ${education?.institution ?? 'education'}`;
  const submitLabel = mode === 'create' ? 'Create education' : 'Save changes';

  const achievementCount = useMemo(() => {
    return splitList(formState.achievementsInput).length;
  }, [formState.achievementsInput]);

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

    return {
      institution: formState.institution.trim(),
      degree: formState.degree.trim(),
      field: formState.field.trim() || undefined,
      location: formState.location.trim() || undefined,
      start: formState.start,
      end: formState.present ? undefined : (formState.end || undefined),
      present: formState.present,
      gpa: formState.gpa.trim() || undefined,
      achievements: achievements.length > 0 ? achievements : [],
      project: formState.project.trim() || undefined,

    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const payload = buildPayload();
      const schema = mode === 'create' ? createEducationSchema : updateEducationSchema;
      const result = schema.safeParse(payload);

      if (!result.success) {
        setFieldErrors(buildFieldErrors(result.error.issues));
        setError('Please fix the errors below.');
        return;
      }

      const url = mode === 'create' ? '/api/v1/education' : `/api/v1/education/${education?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const description = responseData?.error?.message ?? 'Unable to save education record.';
        throw new Error(description);
      }

      setSuccess(mode === 'create' ? 'Education record created successfully!' : 'Education record updated successfully!');
      showToast({
        variant: 'success',
        title: mode === 'create' ? 'Education created' : 'Education updated',
        description: result.data.institution,
      });

      window.location.assign('/admin/education');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
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
        <p className="text-sm text-muted-foreground">Document academic achievements for the public site.</p>
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
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Primary details</h2>
          <div className="space-y-4">
            <LabeledInput
              label="Institution"
              required
              value={formState.institution}
              onChange={handleInputChange('institution')}
              error={fieldErrors.institution}
            />
            <LabeledInput
              label="Degree"
              required
              value={formState.degree}
              onChange={handleInputChange('degree')}
              error={fieldErrors.degree}
            />
            <LabeledInput
              label="Field of study"
              value={formState.field}
              onChange={handleInputChange('field')}
              error={fieldErrors.field}
            />
            <LabeledInput
              label="Location"
              value={formState.location}
              onChange={handleInputChange('location')}
              error={fieldErrors.location}
            />
            <LabeledInput
              label="GPA"
              value={formState.gpa}
              onChange={handleInputChange('gpa')}
              error={fieldErrors.gpa}
              helper="Optional GPA or grade"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Timeline & achievements</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <LabeledInput
                label="Start date"
                type="month"
                required
                value={formState.start}
                onChange={handleInputChange('start')}
                error={fieldErrors.start}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="present"
                  checked={formState.present}
                  onChange={handleCheckboxChange('present')}
                  className="h-4 w-4 rounded border-[var(--border)] accent-accent"
                />
                <label htmlFor="present" className="text-sm font-medium text-foreground">
                  Currently enrolled
                </label>
              </div>
              {!formState.present ? (
                <LabeledInput
                  label="End date"
                  type="month"
                  value={formState.end}
                  onChange={handleInputChange('end')}
                  error={fieldErrors.end}
                />
              ) : null}
            </div>
            <TextareaField
              label="Achievements"
              rows={4}
              value={formState.achievementsInput}
              onChange={handleInputChange('achievementsInput')}
              helper={`One per line or comma-separated. ${achievementCount} achievement${achievementCount !== 1 ? 's' : ''} entered.`}
              error={fieldErrors.achievements}
            />
            <LabeledInput
              label="Notable project"
              value={formState.project}
              onChange={handleInputChange('project')}
              error={fieldErrors.project}
              helper="Optional thesis, capstone, or notable project"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
        <Link
          href="/admin/education"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface LabeledInputProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  helper?: string;
}

function LabeledInput({ label, required, type = 'text', value, onChange, error, helper }: LabeledInputProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span aria-hidden="true" className="text-rose-500"> *</span> : null}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition ${
          error ? 'border-rose-500' : 'border-[var(--border)] focus:border-accent'
        }`}
      />
      {error ? <p id={errorId} className="text-xs text-rose-600">{error}</p> : null}
      {helper && !error ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  rows?: number;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helper?: string;
}

function TextareaField({ label, rows = 4, value, onChange, error, helper }: TextareaFieldProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        id={inputId}
        rows={rows}
        value={value}
        onChange={onChange}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition ${
          error ? 'border-rose-500' : 'border-[var(--border)] focus:border-accent'
        }`}
      />
      {error ? <p id={errorId} className="text-xs text-rose-600">{error}</p> : null}
      {helper && !error ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

