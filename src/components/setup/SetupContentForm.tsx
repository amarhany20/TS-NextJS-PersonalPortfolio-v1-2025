'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentSetupStep from '@/sections/setup/ContentSetupStep';
import {
  clearSetupDraft,
  mergeSetupDraft,
  readSetupDraft,
  SetupDraft,
} from './SetupStorage';

export function SetupContentForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<SetupDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDraft(readSetupDraft());
  }, []);

  const defaultSeed = useMemo(
    () => process.env.NEXT_PUBLIC_SEED_SAMPLE_DATA === 'true',
    []
  );

  const handleComplete = async () => {
    const latest = readSetupDraft();

    if (!latest.database) {
      setError('Database configuration is missing.');
      return;
    }

    if (!latest.admin) {
      setError('Admin account details are missing.');
      return;
    }

    if (!latest.site) {
      setError('Site configuration is missing.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const payload = {
      database: {
        type: 'postgresql' as const,
        connectionString: latest.database.connectionString || undefined,
      },
      admin: latest.admin,
      site: {
        siteTitle: latest.site.siteTitle,
        siteSubtitle: latest.site.siteSubtitle || undefined,
        theme: latest.site.theme,
      },
      content: {
        includeSampleData: latest.content?.includeSampleData ?? defaultSeed,
      },
    };

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.error || result?.message || 'Setup failed');
      }

      clearSetupDraft();
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!draft) {
    return null;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ContentSetupStep
        data={draft.content}
        onUpdate={(data) => {
          mergeSetupDraft({ content: data });
          setDraft((prev) => ({ ...prev, content: data }));
        }}
        onComplete={handleComplete}
        onPrev={() => router.push('/setup/site')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
