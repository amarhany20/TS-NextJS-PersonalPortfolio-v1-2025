import { notFound } from 'next/navigation';

import { PortfolioService } from '@/server/services/PortfolioService';
import { SettingsService } from '@/server/services/SettingsService';
import { ProjectGrid } from '@/components/Portfolio/ProjectGrid';

/**
 * Public portfolio listing sourced from published database records.
 */
export default async function PortfolioPage() {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.portfolio) {
    notFound();
  }

  const projects = await PortfolioService.getPublishedProjects();
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Portfolio</h1>
        <p className="text-[var(--text-secondary)]">Selected projects and case studies</p>
      </div>

      {featuredProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">Featured Projects</h2>
            <span className="rounded-md border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--accent-primary)]">
              Featured
            </span>
          </div>
          <ProjectGrid projects={featuredProjects} />
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Other Projects</h2>
          <ProjectGrid projects={otherProjects} />
        </section>
      )}

      {projects.length === 0 ? <PortfolioEmptyState /> : null}
    </div>
  );
}

/**
 * Keeps the portfolio page launch-safe when no projects are published yet.
 */
function PortfolioEmptyState() {
  return (
    <section className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card-bg)]/60 p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">Portfolio updates are coming soon</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
        Published projects will appear here after they are reviewed and released from the admin CMS.
      </p>
    </section>
  );
}
