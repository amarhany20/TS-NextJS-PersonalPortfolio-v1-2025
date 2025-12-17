import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { SetupSettingsPanel } from '@/components/Admin/Settings/SetupSettingsPanel';

export default async function SetupSettingsPage() {
  const settings = await SettingsRepository.get();

  if (!settings) {
    return (
      <section className="space-y-6 py-6">
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-600">
            Settings have not been initialized. Please run the setup wizard or seed script.
          </p>
        </div>
      </section>
    );
  }

  return <SetupSettingsPanel settings={settings} />;
}

