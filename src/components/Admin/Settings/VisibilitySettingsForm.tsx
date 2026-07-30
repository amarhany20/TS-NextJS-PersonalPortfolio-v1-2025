'use client';

import { useState, useTransition } from 'react';

import type { SiteVisibility } from '@/types/settings';

interface VisibilitySettingsFormProps {
  initialValues: SiteVisibility;
}

interface ToggleFieldProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleField({ title, description, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-4 py-3 cursor-pointer">
      <div className="space-y-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs text-[var(--text-secondary)]">{description}</div>
      </div>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-[var(--accent-muted)] transition peer-checked:bg-[var(--accent-primary)]" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function VisibilitySettingsForm({ initialValues }: VisibilitySettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const setPage = (field: keyof SiteVisibility['pages'], value: boolean) => {
    setValues((current) => ({ ...current, pages: { ...current.pages, [field]: value } }));
  };

  const setSection = (field: keyof SiteVisibility['sections'], value: boolean) => {
    setValues((current) => ({ ...current, sections: { ...current.sections, [field]: value } }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/v1/settings/visibility', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage = payload?.error?.message ?? 'Unable to save visibility settings.';
          setMessage({ type: 'error', text: errorMessage });
          return;
        }

        const nextValues = payload?.data?.visibility as SiteVisibility | undefined;
        if (nextValues) {
          setValues(nextValues);
        }

        setMessage({
          type: 'success',
          text: 'Visibility settings saved. Hidden public pages now disappear from navigation and return 404 directly.',
        });
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Unable to save visibility settings.' });
      }
    });
  };

  return (
    <div className="space-y-6">
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
            <h2 className="text-lg font-semibold text-foreground">Public pages</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              When a page is hidden, it is removed from the public navigation and direct visits
              return a 404 page.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ToggleField
              title="Portfolio page"
              description="Controls /portfolio and portfolio detail pages."
              checked={values.pages.portfolio}
              onChange={(value) => setPage('portfolio', value)}
            />
            <ToggleField
              title="Services page"
              description="Controls /services and removes it from navigation."
              checked={values.pages.services}
              onChange={(value) => setPage('services', value)}
            />
            <ToggleField
              title="Blogs page"
              description="Controls /blogs, blog detail routes, and public navigation visibility."
              checked={values.pages.blogs}
              onChange={(value) => setPage('blogs', value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/70 p-5 sm:p-6">
          <div className="mb-5 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Home sections</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Turn individual home-page sections on or off without deleting the underlying data.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ToggleField
              title="Summary"
              description="Show or hide the hero summary section."
              checked={values.sections.summary}
              onChange={(value) => setSection('summary', value)}
            />
            <ToggleField
              title="Experience"
              description="Show or hide the experience timeline section."
              checked={values.sections.experience}
              onChange={(value) => setSection('experience', value)}
            />
            <ToggleField
              title="Education"
              description="Show or hide the education section."
              checked={values.sections.education}
              onChange={(value) => setSection('education', value)}
            />
            <ToggleField
              title="Certificates"
              description="Show or hide certificates on the home page."
              checked={values.sections.certificates}
              onChange={(value) => setSection('certificates', value)}
            />
            <ToggleField
              title="Recommendations"
              description="Show or hide testimonials and recommendations."
              checked={values.sections.recommendations}
              onChange={(value) => setSection('recommendations', value)}
            />
            <ToggleField
              title="Skills"
              description="Show or hide the grouped skills section."
              checked={values.sections.skills}
              onChange={(value) => setSection('skills', value)}
            />
            <ToggleField
              title="Contact"
              description="Show or hide the /home#contact section."
              checked={values.sections.contact}
              onChange={(value) => setSection('contact', value)}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Saving…' : 'Save visibility settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
