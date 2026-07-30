import React from 'react';
import type { Project } from '@/types/portfolio';

const variantMap = {
  neutral: 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-secondary)]',
  accent:
    'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
};

function Badge({
  children,
  variant = 'neutral',
}: {
  children: React.ReactNode;
  variant?: keyof typeof variantMap;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-sm font-medium tracking-wide uppercase border ${variantMap[variant]}`}
    >
      {children}
    </span>
  );
}

export function ProjectBadges({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge
        variant={
          project.status === 'live'
            ? 'success'
            : project.status === 'in-progress'
              ? 'warning'
              : 'neutral'
        }
      >
        {project.status.replace('-', ' ')}
      </Badge>
      <Badge variant={project.visibility === 'public' ? 'neutral' : 'warning'}>
        {project.visibility}
      </Badge>
      {project.access === 'open-source' ? <Badge variant="accent">Open Source</Badge> : null}
    </div>
  );
}
