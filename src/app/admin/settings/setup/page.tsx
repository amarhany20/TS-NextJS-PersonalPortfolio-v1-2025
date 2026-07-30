import { SetupSettingsPanel } from '@/components/Admin/Settings/SetupSettingsPanel';
import { SettingsService } from '@/server/services/SettingsService';

/**
 * Shows the supported bootstrap status for the relaunch-era admin setup page.
 */
export default async function SetupSettingsPage() {
  const settings = await SettingsService.getSetupStatusSummary();

  if (!settings) {
    return (
      <section className="space-y-6 py-6">
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-600">
            Settings have not been initialized. Configure environment variables, run migrations, and
            bootstrap or seed the database.
          </p>
        </div>
      </section>
    );
  }

  return <SetupSettingsPanel settings={settings} />;
}
