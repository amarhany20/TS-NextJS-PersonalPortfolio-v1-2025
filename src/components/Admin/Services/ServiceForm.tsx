'use client';

import Link from 'next/link';
import { useId, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { createServiceSchema, updateServiceSchema } from '@/server/server-validators/api/service';
import type { Service } from '@/types/service';
import { useToast } from '@/components/ui/ToastProvider';

interface ServiceFormProps {
  mode: 'create' | 'edit';
  service?: Service | null;
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

export function ServiceForm({ mode, service }: ServiceFormProps) {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    title: service?.title ?? '',
    slug: service?.slug ?? '',
    description: service?.description ?? '',
    longDescription: service?.longDescription ?? '',
    featuresInput: (service?.features ?? []).join('\n'),
    technologiesInput: (service?.technologies ?? []).join('\n'),
    icon: service?.icon ?? '',
    image: service?.image ?? '',
    active: service?.active ?? true,
    displayOrder: service?.displayOrder?.toString() ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle = mode === 'create' ? 'Create service' : `Edit ${service?.title ?? 'service'}`;
  const submitLabel = mode === 'create' ? 'Create service' : 'Save changes';

  const featureCount = useMemo(() => splitList(formState.featuresInput).length, [formState.featuresInput]);
  const techCount = useMemo(() => splitList(formState.technologiesInput).length, [formState.technologiesInput]);

  const handleInputChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCheckboxChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.checked }));
  };

  const buildPayload = () => {
    const features = splitList(formState.featuresInput);
    const technologies = splitList(formState.technologiesInput);
    const displayOrder = formState.displayOrder ? Number.parseInt(formState.displayOrder, 10) : undefined;

    return {
      title: formState.title.trim(),
      slug: formState.slug.trim() || undefined,
      description: formState.description.trim(),
      longDescription: formState.longDescription.trim() || undefined,
      features: features.length > 0 ? features : undefined,
      technologies: technologies.length > 0 ? technologies : undefined,
      icon: formState.icon.trim() || undefined,
      image: formState.image.trim() || undefined,
      active: formState.active,
      displayOrder,
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
      const schema = mode === 'create' ? createServiceSchema : updateServiceSchema;
      const result = schema.safeParse(payload);

      if (!result.success) {
        setFieldErrors(buildFieldErrors(result.error.issues));
        setError('Please fix the errors below.');
        return;
      }

      const url = mode === 'create' ? '/api/v1/services' : `/api/v1/services/${service?.slug}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const description = responseData?.error?.message ?? 'Unable to save service.';
        throw new Error(description);
      }

      setSuccess(mode === 'create' ? 'Service created successfully!' : 'Service updated successfully!');
      showToast({
        variant: 'success',
        title: mode === 'create' ? 'Service created' : 'Service updated',
        description: result.data.title,
      });

      window.location.assign('/admin/services');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
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
        <p className="text-sm text-muted-foreground">Define the service offering displayed on the public site.</p>
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
              error={fieldErrors.slug}
              helper="Leave blank to auto-generate from the title."
            />
            <LabeledInput
              label="Short description"
              required
              value={formState.description}
              onChange={handleInputChange('description')}
              error={fieldErrors.description}
              helper="Used in the services list on the public site."
            />
            <LabeledTextarea
              label="Long description"
              value={formState.longDescription}
              onChange={handleInputChange('longDescription')}
              error={fieldErrors.longDescription}
              helper="Optional deeper description for the service page."
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Supporting details</h2>
          <div className="space-y-4">
            <LabeledTextarea
              label="Feature bullets"
              value={formState.featuresInput}
              onChange={handleInputChange('featuresInput')}
              helper={`${featureCount} bullets captured. One per line or comma-separated.`}
            />
            <LabeledTextarea
              label="Technologies"
              value={formState.technologiesInput}
              onChange={handleInputChange('technologiesInput')}
              helper={`${techCount} technologies captured. One per line or comma-separated.`}
            />
            <LabeledInput
              label="Icon"
              value={formState.icon}
              onChange={handleInputChange('icon')}
              helper="Optional icon name or key."
            />
            <LabeledInput
              label="Image"
              value={formState.image}
              onChange={handleInputChange('image')}
              helper="Optional image URL for the service card."
            />
            <LabeledInput
              label="Display order"
              value={formState.displayOrder}
              onChange={handleInputChange('displayOrder')}
              helper="Optional override for ordering."
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formState.active} onChange={handleCheckboxChange('active')} />
              Active (visible on public site)
            </label>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/services"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface LabeledInputProps {
  label: string;
  value: string;
  required?: boolean;
  error?: string;
  helper?: string;
  type?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function LabeledInput({ label, value, required, error, helper, type = 'text', onChange }: LabeledInputProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label} {required ? <span aria-hidden="true"> *</span> : ''}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
      />
      {helper ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
      {error ? <p id={errorId} className="text-xs text-amber-600">{error}</p> : null}
    </div>
  );
}

interface LabeledTextareaProps {
  label: string;
  value: string;
  error?: string;
  helper?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function LabeledTextarea({ label, value, error, helper, onChange }: LabeledTextareaProps) {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium">{label}</label>
      <textarea
        id={inputId}
        value={value}
        onChange={onChange}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
        rows={3}
      />
      {helper ? <p id={helperId} className="text-xs text-muted-foreground">{helper}</p> : null}
      {error ? <p id={errorId} className="text-xs text-amber-600">{error}</p> : null}
    </div>
  );
}
