'use client';

interface SetupSettingsPanelProps {
  settings: {
    setupCompletedAt: Date | null;
    setupVersion: string | null;
    databaseProvider: string | null;
  };
}

function formatDateTime(date: Date | null): string {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function SetupSettingsPanel({ settings }: SetupSettingsPanelProps) {
  return (
    <section className="space-y-6 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Setup Configuration</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          View first-run configuration data and setup completion details.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                Setup Status
              </label>
              <div className="text-sm">
                {settings.setupCompletedAt ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-600">
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-amber-600">
                    Not Completed
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                Database Provider
              </label>
              <div className="text-sm font-medium">
                {settings.databaseProvider ? (
                  <span className="capitalize">{settings.databaseProvider}</span>
                ) : (
                  <span className="text-[var(--text-secondary)]">Not set</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                Setup Version
              </label>
              <div className="text-sm font-medium">
                {settings.setupVersion || <span className="text-[var(--text-secondary)]">Not set</span>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                Completed At
              </label>
              <div className="text-sm font-medium">
                {formatDateTime(settings.setupCompletedAt)}
              </div>
            </div>
          </div>

          {settings.setupCompletedAt && (
            <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--accent-muted)]/30 p-4">
              <p className="text-xs text-[var(--text-secondary)]">
                Setup was completed on {formatDateTime(settings.setupCompletedAt)}. 
                The setup wizard is disabled to prevent accidental re-initialization. 
                To modify settings, use the other settings panels.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

