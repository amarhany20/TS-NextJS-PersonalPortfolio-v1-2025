import { ThemeGallery } from '@/components/Admin/Theme/ThemeGallery';
import { ThemeService } from '@/server/services/ThemeService';

export default async function ThemeSettingsPage() {
  const data = await ThemeService.listThemes();

  return (
    <section className="space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
          Phase 5 · Theme Registry
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Appearance & Theme</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Switch between curated themes without redeploying. Each preset updates the portfolio
          palette, navigation chrome, and component tokens instantly across public and admin
          surfaces.
        </p>
      </header>

      <ThemeGallery themes={data.themes} activeThemeId={data.activeThemeId} />
    </section>
  );
}
