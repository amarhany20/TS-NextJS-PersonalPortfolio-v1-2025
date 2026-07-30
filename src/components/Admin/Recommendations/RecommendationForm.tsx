'use client';

import Link from 'next/link';
import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from 'react';

import {
  createRecommendationSchema,
  updateRecommendationSchema,
} from '@/server/server-validators/api/recommendation';
import type { Recommendation } from '@/types/recommendation';
import { useToast } from '@/components/ui/ToastProvider';

interface RecommendationFormProps {
  mode: 'create' | 'edit';
  recommendation?: Recommendation | null;
}

type FormErrors = Record<string, string>;

interface RecommendationFormState {
  name: string;
  position: string;
  company: string;
  relationship: string;
  content: string;
  rating: string;
  photo: string;
  linkedin: string;
  recommendationLetterUrl: string;
  receivedOn: string;
  published: boolean;
}

/**
 * Normalizes a validator issue list into a field-indexed error map that the form
 * can render next to each control.
 */
const buildFieldErrors = (issues: Array<{ path: PropertyKey[]; message: string }>): FormErrors => {
  const map: FormErrors = {};
  for (const issue of issues) {
    const rawKey = issue.path[0];
    const key =
      typeof rawKey === 'string' || typeof rawKey === 'number' ? rawKey.toString() : 'form';
    if (!map[key]) {
      map[key] = issue.message;
    }
  }
  return map;
};

function formatDateForInput(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

/**
 * Handles create and edit flows for recommendations while keeping the client-side
 * form state aligned with the API validator contracts.
 */
export function RecommendationForm({ mode, recommendation }: RecommendationFormProps) {
  const { showToast } = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [formState, setFormState] = useState<RecommendationFormState>({
    name: recommendation?.name ?? '',
    position: recommendation?.position ?? recommendation?.title ?? '',
    company: recommendation?.company ?? '',
    relationship: recommendation?.relationship ?? '',
    content: recommendation?.content ?? '',
    rating: recommendation?.rating ? String(recommendation.rating) : '',
    photo: recommendation?.photo ?? recommendation?.avatar ?? '',
    linkedin: recommendation?.linkedin ?? recommendation?.linkedinUrl ?? '',
    recommendationLetterUrl: recommendation?.recommendationLetterUrl ?? '',
    receivedOn: formatDateForInput(recommendation?.date),
    published: Boolean(
      (recommendation as (Recommendation & { published?: boolean }) | null | undefined)?.published,
    ),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle =
    mode === 'create'
      ? 'Create recommendation'
      : `Edit recommendation from ${recommendation?.name ?? ''}`;
  const submitLabel = mode === 'create' ? 'Create recommendation' : 'Save changes';

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleInputChange =
    (field: keyof typeof formState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleCheckboxChange =
    (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setFormState((prev) => ({ ...prev, [field]: checked }));
    };

  const buildPayload = () => {
    return {
      name: formState.name.trim(),
      position: formState.position.trim() || undefined,
      company: formState.company.trim() || undefined,
      relationship: formState.relationship.trim() || undefined,
      content: formState.content.trim(),
      rating: formState.rating ? Number.parseInt(formState.rating, 10) : undefined,
      photo: formState.photo.trim() || undefined,
      linkedin: formState.linkedin.trim() || undefined,
      recommendationLetterUrl: formState.recommendationLetterUrl.trim() || undefined,
      receivedOn: formState.receivedOn ? new Date(formState.receivedOn).toISOString() : undefined,
      published: formState.published,
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
      const schema = mode === 'create' ? createRecommendationSchema : updateRecommendationSchema;
      const result = schema.safeParse(payload);

      if (!result.success) {
        setFieldErrors(buildFieldErrors(result.error.issues));
        setError('Please fix the errors below.');
        return;
      }

      const url =
        mode === 'create'
          ? '/api/v1/recommendations'
          : `/api/v1/recommendations/${recommendation?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const description = responseData?.error?.message ?? 'Unable to save recommendation.';
        throw new Error(description);
      }

      setSuccess(
        mode === 'create'
          ? 'Recommendation created successfully!'
          : 'Recommendation updated successfully!',
      );
      showToast({
        variant: 'success',
        title: mode === 'create' ? 'Recommendation created' : 'Recommendation updated',
        description: result.data.name,
      });

      window.location.assign('/admin/recommendations');
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
        <p className="text-sm text-muted-foreground">
          Collect and curate testimonials displayed on the home page.
        </p>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-amber-600 bg-amber-500/10 px-4 py-2 text-sm text-amber-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          className="rounded-lg border border-emerald-600 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600"
          aria-live="polite"
        >
          {success}
        </p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Person details</h2>
          <div className="space-y-4">
            <LabeledInput
              label="Name"
              required
              value={formState.name}
              onChange={handleInputChange('name')}
              error={fieldErrors.name}
            />
            <LabeledInput
              label="Position/Title"
              value={formState.position}
              onChange={handleInputChange('position')}
              error={fieldErrors.position}
            />
            <LabeledInput
              label="Company"
              value={formState.company}
              onChange={handleInputChange('company')}
              error={fieldErrors.company}
            />
            <LabeledInput
              label="Relationship"
              value={formState.relationship}
              onChange={handleInputChange('relationship')}
              error={fieldErrors.relationship}
              helper="e.g., Former Manager, Colleague, Client"
            />
            <LabeledInput
              label="Rating"
              type="number"
              min="1"
              max="5"
              value={formState.rating}
              onChange={handleInputChange('rating')}
              error={fieldErrors.rating}
              helper="Optional rating from 1-5"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Content & links</h2>
          <div className="space-y-4">
            <TextareaField
              label="Recommendation content"
              rows={6}
              required
              value={formState.content}
              onChange={handleInputChange('content')}
              error={fieldErrors.content}
            />
            <LabeledInput
              label="Photo URL"
              type="url"
              value={formState.photo}
              onChange={handleInputChange('photo')}
              error={fieldErrors.photo}
              helper="URL to person's photo or avatar"
            />
            <LabeledInput
              label="LinkedIn URL"
              type="url"
              value={formState.linkedin}
              onChange={handleInputChange('linkedin')}
              error={fieldErrors.linkedin}
            />
            <LabeledInput
              label="Recommendation letter URL"
              type="url"
              value={formState.recommendationLetterUrl}
              onChange={handleInputChange('recommendationLetterUrl')}
              error={fieldErrors.recommendationLetterUrl}
              helper="Link to full recommendation letter if available"
            />
            <LabeledInput
              label="Received date"
              type="date"
              value={formState.receivedOn}
              onChange={handleInputChange('receivedOn')}
              error={fieldErrors.receivedOn}
              helper="Optional date when recommendation was received"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formState.published}
                onChange={handleCheckboxChange('published')}
                className="h-4 w-4 rounded border-[var(--border)] accent-accent"
              />
              <label htmlFor="published" className="text-sm font-medium text-foreground">
                Published (visible on public site)
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
        <Link
          href="/admin/recommendations"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!hydrated || submitting}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!hydrated ? 'Loading…' : submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface LabeledInputProps {
  label: string;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  helper?: string;
}

function LabeledInput({
  label,
  required,
  type = 'text',
  min,
  max,
  value,
  onChange,
  error,
  helper,
}: LabeledInputProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-rose-500">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <input
        id={inputId}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition ${
          error ? 'border-rose-500' : 'border-[var(--border)] focus:border-accent'
        }`}
      />
      {error ? (
        <p id={errorId} className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
      {helper && !error ? (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  rows?: number;
  required?: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helper?: string;
}

function TextareaField({
  label,
  rows = 4,
  required,
  value,
  onChange,
  error,
  helper,
}: TextareaFieldProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-rose-500">
            {' '}
            *
          </span>
        ) : null}
      </label>
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
      {error ? (
        <p id={errorId} className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
      {helper && !error ? (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
