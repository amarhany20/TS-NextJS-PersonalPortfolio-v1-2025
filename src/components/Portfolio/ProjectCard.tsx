import Link from 'next/link';
import type { ReactNode } from 'react';

import type { Project } from '@/types/portfolio';

type BadgeVariant = 'neutral' | 'accent' | 'warning' | 'success';

const badgeStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-secondary)]',
  accent:
    'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
};

/**
 * Renders a compact project card for public portfolio listings.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card-bg)] transition hover:border-[var(--accent-primary)]/40"
    >
      <div className="h-40 w-full bg-gradient-to-br from-[var(--border)]/20 to-transparent" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1">
          <ProjectBadge variant={statusVariant(project.status)}>
            {project.status.replace('-', ' ')}
          </ProjectBadge>
          <ProjectBadge variant={project.visibility === 'public' ? 'neutral' : 'warning'}>
            {project.visibility}
          </ProjectBadge>
          {project.access === 'open-source' ? (
            <ProjectBadge variant="accent">Open Source</ProjectBadge>
          ) : null}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-foreground transition group-hover:text-[var(--accent-primary)]">
            {project.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">{project.tagline}</p>
        </div>

        <p className="line-clamp-3 flex-1 text-sm text-[var(--text-secondary)]">{project.intro}</p>

        {project.stack.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((technology) => (
              <span
                key={technology}
                className="rounded bg-[var(--border)]/30 px-2 py-0.5 text-[10px] text-[var(--text-secondary)]"
              >
                {technology}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

/**
 * Renders a portfolio-list badge using the shared project status color map.
 */
function ProjectBadge({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${badgeStyles[variant]}`}
    >
      {children}
    </span>
  );
}

function statusVariant(status: Project['status']): BadgeVariant {
  switch (status) {
    case 'in-progress':
      return 'warning';
    case 'live':
      return 'success';
    default:
      return 'neutral';
  }
}
