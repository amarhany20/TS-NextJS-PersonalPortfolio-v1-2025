'use client';

import Link from 'next/link';
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import type { ZodIssue } from 'zod';

import { projectCreateSchema, projectUpdateSchema } from '@/client-validators/forms/portfolio';
import type { Project, ProjectAccess, ProjectStatus, ProjectVisibility } from '@/types/portfolio';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  project?: Project | null;
}

const VISIBILITY_OPTIONS: ProjectVisibility[] = ['public', 'private', 'internal'];
const ACCESS_OPTIONS: ProjectAccess[] = ['open-source', 'proprietary', 'client-owned'];
const STATUS_OPTIONS: ProjectStatus[] = ['planning', 'in-progress', 'live', 'archived'];

const now = new Date();
const currentYearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

type FormErrors = Record<string, string>;

const splitList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const buildFieldErrors = (issues: ZodIssue[]): FormErrors => {
  const map: FormErrors = {};
  for (const issue of issues) {
    const key = issue.path[0]?.toString() ?? 'form';
    if (!map[key]) {
      map[key] = issue.message;
    }
  }
  return map;
};

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const [hydrated, setHydrated] = useState(false);
  const [formState, setFormState] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    tagline: project?.tagline ?? '',
    intro: project?.intro ?? '',
    summary: project?.summary ?? '',
    role: project?.role ?? '',
    domain: project?.domain ?? '',
    company: project?.company ?? '',
    client: project?.client ?? '',
    website: project?.website ?? '',
    repository: project?.repository ?? '',
    start: project?.start ?? currentYearMonth,
    end: project?.end ?? '',
    stackInput: (project?.stack ?? []).join('\n'),
    featuresInput: (project?.features ?? []).join('\n'),
    confidentialNotes: project?.confidentialNotes ?? '',
    visibility: project?.visibility ?? 'public',
    access: project?.access ?? 'open-source',
    status: project?.status ?? 'planning',
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    displayOrder: project?.displayOrder ? String(project.displayOrder) : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle = mode === 'create' ? 'Create project' : `Edit ${project?.title ?? 'project'}`;
  const submitLabel = mode === 'create' ? 'Create project' : 'Save changes';

  useEffect(() => {
    setHydrated(true);
  }, []);

  const derivedSummary = useMemo(() => {
    return {
      stackCount: splitList(formState.stackInput).length,
      featureCount: splitList(formState.featuresInput).length,
    };
  }, [formState.stackInput, formState.featuresInput]);

  const handleCheckboxChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormState((prev) => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (
    field: keyof typeof formState,
    formatter?: (value: string) => string,
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = formatter ? formatter(event.target.value) : event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const buildPayload = () => {
    const stack = splitList(formState.stackInput);
    const features = splitList(formState.featuresInput);

    const payload = {
      title: formState.title.trim(),
      slug: formState.slug.trim() || undefined,
      tagline: formState.tagline.trim(),
      intro: formState.intro.trim(),
      summary: formState.summary.trim(),
      featured: formState.featured,
      visibility: formState.visibility,
      access: formState.access,
      status: formState.status,
      domain: formState.domain.trim() || undefined,
      company: formState.company.trim() || undefined,
      client: formState.client.trim() || undefined,
      website: formState.website.trim() || undefined,
      repository: formState.repository.trim() || undefined,
      role: formState.role.trim(),
      start: formState.start,
      end: formState.end || undefined,
      stack,
      features,
      confidentialNotes: formState.confidentialNotes.trim() || undefined,
      displayOrder: formState.displayOrder ? Number(formState.displayOrder) : undefined,
      published: formState.published,
    } as Record<string, unknown>;

    return payload;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const payload = buildPayload();
    const schema = mode === 'create' ? projectCreateSchema : projectUpdateSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      setSubmitting(false);
      setError('Fix the highlighted fields and try again.');
      setFieldErrors(buildFieldErrors(result.error.issues));
      return;
    }

    const endpoint = mode === 'create' ? '/api/v1/portfolio' : project ? `/api/v1/portfolio/${project.slug}` : null;
    if (!endpoint) {
      setSubmitting(false);
      setError('Project context missing. Refresh and try again.');
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
        const message = payloadJson?.error?.message ?? 'Unable to save project.';
        throw new Error(message);
      }

      setSuccess(mode === 'create' ? 'Project created.' : 'Project updated.');
      window.location.assign('/admin/portfolio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground">
          Provide the core details for your case study. Required fields ensure the public portfolio has everything it needs.
        </p>
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
              label="Project title"
              required
              value={formState.title}
              onChange={handleInputChange('title')}
              error={fieldErrors.title}
            />
            <LabeledInput
              label="Slug"
              placeholder="auto-generated if empty"
              value={formState.slug}
              onChange={handleInputChange('slug', (value) => value.toLowerCase())}
              helper="Used in URLs, lowercase letters, numbers, and hyphens."
              error={fieldErrors.slug}
            />
            <TextareaField
              label="Tagline"
              required
              rows={2}
              value={formState.tagline}
              onChange={handleInputChange('tagline')}
              error={fieldErrors.tagline}
            />
            <TextareaField
              label="Intro"
              required
              rows={3}
              value={formState.intro}
              onChange={handleInputChange('intro')}
              error={fieldErrors.intro}
            />
            <TextareaField
              label="Summary"
              required
              rows={4}
              value={formState.summary}
              onChange={handleInputChange('summary')}
              helper="Longer description shown on detail pages."
              error={fieldErrors.summary}
            />
            <LabeledInput
              label="Role"
              required
              value={formState.role}
              onChange={handleInputChange('role')}
              error={fieldErrors.role}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Meta & operations</h2>
          <div className="grid gap-4">
            <SelectField
              label="Visibility"
              value={formState.visibility}
              onChange={handleInputChange('visibility')}
              options={VISIBILITY_OPTIONS}
            />
            <SelectField
              label="Access"
              value={formState.access}
              onChange={handleInputChange('access')}
              options={ACCESS_OPTIONS}
            />
            <SelectField
              label="Status"
              value={formState.status}
              onChange={handleInputChange('status')}
              options={STATUS_OPTIONS}
            />
            <div className="grid grid-cols-2 gap-4">
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
                helper="Leave blank if ongoing"
                error={fieldErrors.end}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <LabeledInput
                label="Company"
                value={formState.company}
                onChange={handleInputChange('company')}
              />
              <LabeledInput
                label="Client"
                value={formState.client}
                onChange={handleInputChange('client')}
              />
            </div>
            <LabeledInput
              label="Domain"
              placeholder="e.g. e-commerce, ai, ops"
              value={formState.domain}
              onChange={handleInputChange('domain')}
            />
            <LabeledInput
              label="Website"
              type="url"
              value={formState.website}
              onChange={handleInputChange('website')}
              error={fieldErrors.website}
            />
            <LabeledInput
              label="Repository"
              type="url"
              value={formState.repository}
              onChange={handleInputChange('repository')}
              error={fieldErrors.repository}
            />
            <div className="grid grid-cols-2 gap-4">
              <LabeledInput
                label="Display order"
                type="number"
                min={0}
                value={formState.displayOrder}
                onChange={handleInputChange('displayOrder')}
                helper="Optional override for list position"
              />
              <div className="space-y-2 rounded-xl border border-dashed border-[var(--border)] p-4 text-sm">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formState.featured} onChange={handleCheckboxChange('featured')} />
                  Featured project
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formState.published} onChange={handleCheckboxChange('published')} />
                  Published
                </label>
                <p className="text-xs text-muted-foreground">Draft projects stay hidden from the public site.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Stack & highlights</h2>
          <TextareaField
            label="Stack"
            required
            rows={5}
            value={formState.stackInput}
            onChange={handleInputChange('stackInput')}
            helper={`One technology per line. Currently tracking ${derivedSummary.stackCount} item${derivedSummary.stackCount === 1 ? '' : 's'}.`}
            error={fieldErrors.stack}
          />
          <TextareaField
            label="Feature bullets"
            rows={4}
            value={formState.featuresInput}
            onChange={handleInputChange('featuresInput')}
            helper={`Optional. ${derivedSummary.featureCount} bullet${derivedSummary.featureCount === 1 ? '' : 's'} captured.`}
            error={fieldErrors.features}
          />
        </div>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/30 p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Internal notes</h2>
          <TextareaField
            label="Confidential notes"
            rows={9}
            value={formState.confidentialNotes}
            onChange={handleInputChange('confidentialNotes')}
            helper="Visible only inside the admin area. Useful for reminders or client context."
            error={fieldErrors.confidentialNotes}
          />
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 order-1 sm:order-none"
          disabled={!hydrated || submitting}
        >
          {!hydrated ? 'Loading…' : submitting ? 'Saving…' : submitLabel}
        </button>
        <Link
          href="/admin/portfolio"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-accent text-center sm:text-left order-2 sm:order-none"
        >
          Cancel
        </Link>
        {project?.slug ? (
          <Link
            href={`/portfolio/${project.slug}`}
            prefetch={false}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline text-center sm:text-left order-3 sm:order-none"
          >
            View public page
          </Link>
        ) : null}
      </div>
    </form>
  );
}

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
}

function LabeledInput({ label, helper, error, required, className, ...props }: LabeledInputProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1 text-sm font-medium text-foreground">
      <label htmlFor={inputId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : ''}
      </label>
      <input
        id={inputId}
        {...props}
        required={required}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent ${className ?? ''}`}
      />
      {helper ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
      {error ? (
        <p id={errorId} className="text-xs text-amber-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string;
  error?: string;
}

function TextareaField({ label, helper, error, required, className, ...props }: TextareaFieldProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1 text-sm font-medium text-foreground">
      <label htmlFor={inputId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : ''}
      </label>
      <textarea
        id={inputId}
        {...props}
        required={required}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent ${className ?? ''}`}
      />
      {helper ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
      {error ? (
        <p id={errorId} className="text-xs text-amber-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="space-y-1 text-sm font-medium text-foreground">
      <span>{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[var(--background)] text-foreground">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
