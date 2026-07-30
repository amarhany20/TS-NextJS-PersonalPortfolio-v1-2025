import { VisibilitySettingsForm } from '@/components/Admin/Settings/VisibilitySettingsForm';
import { SettingsService } from '@/server/services/SettingsService';

export default async function VisibilitySettingsPage() {
  const settings = await SettingsService.getVisibilitySettings();

  return (
    <section className="space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
          Admin Settings
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Visibility Controls</h1>
        <p className="max-w-3xl text-sm text-[var(--text-secondary)]">
          Control which public pages appear in navigation and which home-page sections stay visible
          without deleting content from the database.
        </p>
      </header>

      <VisibilitySettingsForm initialValues={settings} />
    </section>
  );
}
