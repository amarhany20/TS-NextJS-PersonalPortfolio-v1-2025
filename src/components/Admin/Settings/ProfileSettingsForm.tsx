'use client';

import { useState, useTransition } from 'react';

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

function LabeledField({ label, helper, required, value, type = 'text', onChange }: LabeledFieldProps) {
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
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const setField = <K extends keyof ProfileSettingsValues>(field: K, value: ProfileSettingsValues[K]) => {
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
          text: 'Site profile saved. Refresh the public pages if you have them open in another tab.',
        });
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Unable to save site profile settings.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          These fields drive your public name, hero copy, contact details, and profile/sidebar content after the initial bootstrap.
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
            <h2 className="text-lg font-semibold text-foreground">Public identity</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Update the main text people see first on the portfolio.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LabeledField
              label="Full name"
              required
              helper="Shown in the public sidebar/profile and used as the default site title."
              value={values.siteTitle}
              onChange={(value) => setField('siteTitle', value)}
            />
            <LabeledField
              label="Professional title"
              helper="Used as your short role/tagline in profile surfaces."
              value={values.siteSubtitle}
              onChange={(value) => setField('siteSubtitle', value)}
            />
            <LabeledField
              label="Hero greeting"
              helper="Short opening line above the hero content."
              value={values.heroGreeting}
              onChange={(value) => setField('heroGreeting', value)}
            />
            <LabeledField
              label="Hero subtitle"
              helper="Main supporting line in the hero section."
              value={values.heroSubtitle}
              onChange={(value) => setField('heroSubtitle', value)}
            />
          </div>

          <div className="mt-4">
            <LabeledTextarea
              label="Hero description"
              helper="Longer introduction shown in the main hero area and reused in metadata fallbacks."
              rows={5}
              value={values.heroDescription}
              onChange={(value) => setField('heroDescription', value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5 sm:p-6">
          <div className="mb-5 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Contact details</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Keep the basic public contact details accurate here. You can expand theme and diagnostics separately.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LabeledField
              label="Primary email"
              type="email"
              value={values.primaryEmail}
              onChange={(value) => setField('primaryEmail', value)}
            />
            <LabeledField
              label="Secondary email"
              type="email"
              value={values.secondaryEmail}
              onChange={(value) => setField('secondaryEmail', value)}
            />
            <LabeledField
              label="Location"
              value={values.location}
              onChange={(value) => setField('location', value)}
            />
            <LabeledField
              label="Timezone"
              helper="Optional admin-facing reference such as Europe/Stockholm or Africa/Cairo."
              value={values.timezone}
              onChange={(value) => setField('timezone', value)}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Saving…' : 'Save profile settings'}
          </button>
        </div>
      </form>
    </div>
  );
}