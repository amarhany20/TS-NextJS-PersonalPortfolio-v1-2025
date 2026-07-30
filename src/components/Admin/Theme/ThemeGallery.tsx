'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  accent: string;
  previewGradient: string;
  version: string;
  tags: string[];
  isActive: boolean;
}

interface ThemeGalleryProps {
  themes: ThemeOption[];
  activeThemeId: string;
}

export function ThemeGallery({ themes, activeThemeId }: ThemeGalleryProps) {
  const [selectedTheme, setSelectedTheme] = useState(activeThemeId);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.documentElement.dataset.theme = selectedTheme;
  }, [selectedTheme]);

  useEffect(() => {
    if (!previewTheme) {
      return;
    }

    const root = document.documentElement;
    const previous = root.dataset.theme;
    root.dataset.theme = previewTheme;

    return () => {
      root.dataset.theme = previous ?? selectedTheme;
    };
  }, [previewTheme, selectedTheme]);

  useEffect(() => {
    setSelectedTheme(activeThemeId);
  }, [activeThemeId]);

  const handlePreview = (themeId: string) => {
    if (themeId === selectedTheme) {
      setPreviewTheme(null);
      setMessage(null);
      return;
    }

    setPreviewTheme((current) => (current === themeId ? null : themeId));
    setMessage(null);
  };

  const handleApply = (themeId: string) => {
    setMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch('/api/v1/themes/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId }),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        setSelectedTheme(themeId);
        setPreviewTheme(null);
        setMessage({
          type: 'success',
          text: 'Theme applied. Refresh the public site to preview the change for visitors.',
        });
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Unable to apply theme. Please try again.' });
      }
    });
  };

  const banner = useMemo(() => {
    if (!message) {
      return null;
    }

    const baseClass = 'rounded-lg border px-4 py-3 text-sm';
    if (message.type === 'success') {
      return (
        <div className={`${baseClass} border-emerald-400 text-emerald-100 bg-emerald-400/10`}>
          {message.text}
        </div>
      );
    }

    return (
      <div className={`${baseClass} border-red-400 text-red-100 bg-red-400/10`}>{message.text}</div>
    );
  }, [message]);

  return (
    <div className="space-y-6">
      {banner}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => {
          const isActive = selectedTheme === theme.id;
          const isPreviewing = !isActive && previewTheme === theme.id;

          return (
            <article
              key={theme.id}
              className={`rounded-2xl border bg-[var(--card-bg)]/60 p-4 shadow-sm transition-colors ${
                isActive
                  ? 'border-[var(--accent-primary)] shadow-[0_0_0_1px_var(--accent-primary)]'
                  : 'border-[var(--border)]'
              }`}
            >
              <div
                className="h-36 w-full rounded-xl border border-white/10"
                style={{ backgroundImage: theme.previewGradient }}
              />

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{theme.name}</h2>
                    <p className="text-xs text-[var(--text-secondary)]">v{theme.version}</p>
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-[var(--accent-primary)]/20 px-3 py-1 text-xs font-semibold text-[var(--accent-primary)]">
                      Active
                    </span>
                  )}
                  {isPreviewing && (
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300">
                      Previewing
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{theme.description}</p>
                <div className="flex flex-wrap gap-2">
                  {theme.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] rounded-full bg-[var(--accent-muted)]/70 px-2 py-0.5 uppercase tracking-wide text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {isActive ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] cursor-not-allowed"
                  >
                    Current theme
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePreview(theme.id)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      isPreviewing
                        ? 'border-amber-400 text-amber-200'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-foreground'
                    }`}
                  >
                    Preview
                  </button>
                )}
                <button
                  type="button"
                  disabled={isActive || isPending}
                  onClick={() => handleApply(theme.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-muted)] text-[var(--text-secondary)] cursor-not-allowed'
                      : 'bg-[var(--accent-primary)] text-black hover:opacity-90'
                  } ${isPending ? 'opacity-75' : ''}`}
                >
                  {isActive ? 'Active' : isPending ? 'Applying…' : 'Activate'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
