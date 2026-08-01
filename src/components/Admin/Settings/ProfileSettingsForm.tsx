'use client';

import { useState, useTransition } from 'react';
import { logger } from '@/utils/logger';

type ProfileSettingsValues = {
  siteTitle: string;
  siteSubtitle: string;
  heroGreeting: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryEmail: string;
  secondaryEmail: string;
  location: string;
  timezone: string;
  photoUrl?: string;
};

interface ProfileSettingsFormProps {
  initialValues: ProfileSettingsValues;
}

interface LabeledFieldProps {
  label: string;
  helper?: string;
  required?: boolean;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}

function LabeledField({
  label,
  helper,
  required,
  value,
  type = 'text',
  onChange,
}: LabeledFieldProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-foreground">
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[var(--accent-primary)]"
      />
      {helper ? <span className="block text-xs text-[var(--text-secondary)]">{helper}</span> : null}
    </label>
  );
}

interface LabeledTextareaProps {
  label: string;
  helper?: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}

function LabeledTextarea({ label, helper, value, rows = 4, onChange }: LabeledTextareaProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-foreground">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[var(--accent-primary)]"
      />
      {helper ? <span className="block text-xs text-[var(--text-secondary)]">{helper}</span> : null}
    </label>
  );
}

export function ProfileSettingsForm({ initialValues }: ProfileSettingsFormProps) {
  const [values, setValues] = useState<ProfileSettingsValues>({
    ...initialValues,
    photoUrl: initialValues.photoUrl || '/images/avatar.svg',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const setField = <K extends keyof ProfileSettingsValues>(
    field: K,
    value: ProfileSettingsValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/v1/settings/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage = payload?.error?.message ?? 'Unable to save site profile settings.';
          setMessage({ type: 'error', text: errorMessage });
          return;
        }

        const nextValues = payload?.data?.settings as ProfileSettingsValues | undefined;
        if (nextValues) {
          setValues(nextValues);
        }

        setMessage({
          type: 'success',
          text: 'Site profile saved. Refresh the public pages or admin sidebar if open.',
        });
      } catch (error) {
        logger.error('Failed to save site profile settings', error);
        setMessage({ type: 'error', text: 'Unable to save site profile settings.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          These fields drive your public name, profile photo, hero copy, contact details, and admin
          sidebar avatar.
        </p>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-red-500/40 bg-red-500/10 text-red-200'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5 sm:p-6">
          <div className="mb-5 space-y-1">
            <h2 className="text-base font-semibold text-foreground">Identity & Profile Avatar</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Your name, title, and profile picture displayed across the site and admin panel.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-[var(--border)]/60 bg-[var(--background)]/50">
              <img
                src={values.photoUrl || '/images/avatar.svg'}
                alt="Profile Avatar Preview"
                className="h-16 w-16 rounded-full object-cover shadow border-2 border-[var(--accent-primary)] shrink-0"
              />
              <div className="flex-1 w-full">
                <LabeledField
                  label="Profile Avatar Photo URL"
                  helper="Enter a relative image path (e.g. /images/avatar.svg) or absolute image URL."
                  value={values.photoUrl ?? ''}
                  onChange={(val) => setField('photoUrl', val)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledField
                label="Full Name"
                required
                value={values.siteTitle}
                onChange={(val) => setField('siteTitle', val)}
              />
              <LabeledField
                label="Professional Title"
                helper="e.g. Senior Software Engineer"
                value={values.siteSubtitle}
                onChange={(val) => setField('siteSubtitle', val)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5 sm:p-6">
          <div className="mb-5 space-y-1">
            <h2 className="text-base font-semibold text-foreground">Hero Section</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Headline and intro description shown in the homepage hero header.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledField
                label="Hero Greeting"
                value={values.heroGreeting}
                onChange={(val) => setField('heroGreeting', val)}
              />
              <LabeledField
                label="Hero Subtitle"
                value={values.heroSubtitle}
                onChange={(val) => setField('heroSubtitle', val)}
              />
            </div>

            <LabeledTextarea
              label="Hero Description"
              value={values.heroDescription}
              rows={4}
              onChange={(val) => setField('heroDescription', val)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5 sm:p-6">
          <div className="mb-5 space-y-1">
            <h2 className="text-base font-semibold text-foreground">Contact & Location</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Emails, location, and timezone shown on contact forms and site footer.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField
              label="Primary Email"
              type="email"
              value={values.primaryEmail}
              onChange={(val) => setField('primaryEmail', val)}
            />
            <LabeledField
              label="Secondary Email"
              type="email"
              value={values.secondaryEmail}
              onChange={(val) => setField('secondaryEmail', val)}
            />
            <LabeledField
              label="Location"
              value={values.location}
              onChange={(val) => setField('location', val)}
            />
            <LabeledField
              label="Timezone"
              value={values.timezone}
              onChange={(val) => setField('timezone', val)}
            />
          </div>
        </section>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-black shadow transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Profile Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
