import { ProfileSettingsForm } from '@/components/Admin/Settings/ProfileSettingsForm';
import { SettingsService } from '@/server/services/SettingsService';

export default async function ProfileSettingsPage() {
  const settings = await SettingsService.getProfileSettings();

  return (
    <section className="space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Admin Settings</p>
        <h1 className="text-2xl font-semibold text-foreground">Site Profile</h1>
        <p className="max-w-3xl text-sm text-[var(--text-secondary)]">
          Edit your name, main hero copy, and core contact details here. These values feed the public profile/sidebar,
          hero section, and contact section after the first-run bootstrap.
        </p>
      </header>

      <ProfileSettingsForm initialValues={settings} />
    </section>
  );
}