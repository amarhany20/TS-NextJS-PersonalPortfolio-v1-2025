import React from 'react';
import type { Project } from '@/types/portfolio';
import { formatProjectDuration } from '@/utils/helpers';

function Row({ label, children }: { label: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="text-sm text-foreground break-words leading-snug">{children}</div>
    </div>
  );
}

export function ProjectMetaGrid({ project }: { project: Project }) {
  return (
    <div className="grid gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--card-bg)]">
      <Row label="Company">{project.company}</Row>
      <Row label="Website">
        {project.website ? (
          <a
            className="hover:text-[var(--accent-primary)]"
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.website}
          </a>
        ) : null}
      </Row>
      <Row label="Repository">
        {project.repository ? (
          <a
            className="hover:text-[var(--accent-primary)]"
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        ) : project.access === 'open-source' ? (
          '—'
        ) : (
          'Private'
        )}
      </Row>
      <Row label="Timeline">
        {project.end ? `${project.start} → ${project.end}` : `${project.start} → Present`}{' '}
        <span className="text-[10px] ml-1 text-[var(--text-secondary)]">
          ({formatProjectDuration(project.start, project.end)})
        </span>
      </Row>
      <Row label="Role">{project.role}</Row>
      <Row label="Stack">
        <div className="flex flex-wrap gap-1">
          {project.stack.map((s) => (
            <span key={s} className="text-[10px] bg-[var(--border)]/30 px-2 py-0.5 rounded">
              {s}
            </span>
          ))}
        </div>
      </Row>
      {project.features ? (
        <Row label="Key Features">
          <ul className="list-disc list-inside text-xs space-y-1">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Row>
      ) : null}
      {project.confidentialNotes ? (
        <div className="mt-1 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 leading-relaxed">
          {project.confidentialNotes}
        </div>
      ) : null}
    </div>
  );
}
