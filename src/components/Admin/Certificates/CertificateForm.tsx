'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import { createCertificateSchema, updateCertificateSchema } from '@/server/server-validators/api/certificate';
import type { Certificate } from '@/types/certificate';
import { useToast } from '@/components/ui/ToastProvider';

interface CertificateFormProps {
  mode: 'create' | 'edit';
  certificate?: Certificate | null;
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

function formatDateForInput(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

export function CertificateForm({ mode, certificate }: CertificateFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    name: certificate?.name ?? '',
    issuer: certificate?.issuer ?? '',
    issuedOn: formatDateForInput(certificate?.date),
    credentialId: certificate?.credential ?? '',
    description: certificate?.description ?? '',
    skillsInput: (certificate?.skills ?? []).join('\n'),
    image: certificate?.image ?? '',
    verifyUrl: certificate?.verifyUrl ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const pageTitle = mode === 'create' ? 'Create certificate' : `Edit ${certificate?.name ?? 'certificate'}`;
  const submitLabel = mode === 'create' ? 'Create certificate' : 'Save changes';

  const skillCount = useMemo(() => {
    return splitList(formState.skillsInput).length;
  }, [formState.skillsInput]);

  const handleInputChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const buildPayload = () => {
    const skills = splitList(formState.skillsInput);

    return {
      name: formState.name.trim(),
      issuer: formState.issuer.trim(),
      issuedOn: formState.issuedOn ? new Date(formState.issuedOn).toISOString() : new Date().toISOString(),
      credentialId: formState.credentialId.trim() || undefined,
      description: formState.description.trim() || undefined,
      skills: skills.length > 0 ? skills : undefined,
      image: formState.image.trim() || undefined,
      verifyUrl: formState.verifyUrl.trim() || undefined,
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
      const schema = mode === 'create' ? createCertificateSchema : updateCertificateSchema;
      const result = schema.safeParse(payload);

      if (!result.success) {
        setFieldErrors(buildFieldErrors(result.error.issues));
        setError('Please fix the errors below.');
        return;
      }

      const url = mode === 'create' ? '/api/v1/certificates' : `/api/v1/certificates/${certificate?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const description = responseData?.error?.message ?? 'Unable to save certificate.';
        throw new Error(description);
      }

      setSuccess(mode === 'create' ? 'Certificate created successfully!' : 'Certificate updated successfully!');
      showToast({
        variant: 'success',
        title: mode === 'create' ? 'Certificate created' : 'Certificate updated',
        description: result.data.name,
      });

      setTimeout(() => {
        router.push('/admin/certificates');
        router.refresh();
      }, 1000);
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
        <p className="text-sm text-muted-foreground">Document professional certifications and verification links.</p>
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
              label="Certificate name"
              required
              value={formState.name}
              onChange={handleInputChange('name')}
              error={fieldErrors.name}
            />
            <LabeledInput
              label="Issuer"
              required
              value={formState.issuer}
              onChange={handleInputChange('issuer')}
              error={fieldErrors.issuer}
            />
            <LabeledInput
              label="Issued date"
              type="date"
              required
              value={formState.issuedOn}
              onChange={handleInputChange('issuedOn')}
              error={fieldErrors.issuedOn}
            />
            <LabeledInput
              label="Credential ID"
              value={formState.credentialId}
              onChange={handleInputChange('credentialId')}
              error={fieldErrors.credentialId}
              helper="Optional verification or license number"
            />
            <TextareaField
              label="Description"
              rows={3}
              value={formState.description}
              onChange={handleInputChange('description')}
              error={fieldErrors.description}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-5">
          <h2 className="text-lg font-semibold">Additional information</h2>
          <div className="space-y-4">
            <TextareaField
              label="Skills"
              rows={4}
              value={formState.skillsInput}
              onChange={handleInputChange('skillsInput')}
              helper={`One per line or comma-separated. ${skillCount} skill${skillCount !== 1 ? 's' : ''} entered.`}
              error={fieldErrors.skills}
            />
            <LabeledInput
              label="Image URL"
              type="url"
              value={formState.image}
              onChange={handleInputChange('image')}
              error={fieldErrors.image}
              helper="URL to certificate image or badge"
            />
            <LabeledInput
              label="Verification URL"
              type="url"
              value={formState.verifyUrl}
              onChange={handleInputChange('verifyUrl')}
              error={fieldErrors.verifyUrl}
              helper="Link to verify this certificate online"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
        <Link
          href="/admin/certificates"
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
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition ${
          error ? 'border-rose-500' : 'border-[var(--border)] focus:border-accent'
        }`}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      {helper && !error ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
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
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition ${
          error ? 'border-rose-500' : 'border-[var(--border)] focus:border-accent'
        }`}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      {helper && !error ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

