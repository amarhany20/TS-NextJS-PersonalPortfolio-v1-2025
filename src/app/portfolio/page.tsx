import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PortfolioService } from '@/server/services/PortfolioService';
import { SettingsService } from '@/server/services/SettingsService';
import { ProjectGrid } from '@/components/Portfolio/ProjectGrid';
import { StackFilterBar, filterProjectsByStack } from '@/components/Portfolio/StackFilterBar';
import { buildPageMetadata } from '@/server/server-utils/seo';

type Props = {
  searchParams: Promise<{ stack?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/portfolio');
}

/**
 * Public portfolio listing sourced from published database records.
 * Supports `?stack=` query parameter to filter by technology.
 */
export default async function PortfolioPage({ searchParams }: Props) {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.portfolio) {
    notFound();
  }

  const params = await searchParams;
  const activeStack = params.stack?.trim() || null;
  const allProjects = await PortfolioService.getPublishedProjects();
  const filtered = activeStack ? filterProjectsByStack(allProjects, activeStack) : allProjects;
  const featuredProjects = filtered.filter((project) => project.featured);
  const otherProjects = filtered.filter((project) => !project.featured);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Portfolio</h1>
        <p className="text-[var(--text-secondary)]">Selected projects and case studies</p>
      </div>

      <StackFilterBar projects={allProjects} activeStack={activeStack} />

      {filtered.length === 0 && allProjects.length > 0 && <FilterEmptyState stack={activeStack} />}

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

      {allProjects.length === 0 && <PortfolioEmptyState />}
    </div>
  );
}

function FilterEmptyState({ stack }: { stack: string | null }) {
  return (
    <section className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card-bg)]/60 p-6 text-center">
      <h2 className="text-lg font-semibold text-foreground">No projects match that filter</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">
        {stack
          ? `No published projects use "${stack}". Try a different filter or clear to see all projects.`
          : 'No published projects match the current filter.'}
      </p>
    </section>
  );
}

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
