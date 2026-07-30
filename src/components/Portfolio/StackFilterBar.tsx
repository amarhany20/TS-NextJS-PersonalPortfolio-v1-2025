/**
 * Server component that renders a row of stack filter chips above the
 * portfolio grid. Each chip is a link to `/portfolio?stack=<name>` and
 * clicking the active chip clears the filter (returns to unfiltered view).
 *
 * Pure server component — reads the URL via `searchParams` and renders
 * static links; no client JS required.
 */

import Link from 'next/link';

import type { Project } from '@/types/portfolio';

export function StackFilterBar({
  projects,
  activeStack,
}: {
  projects: Project[];
  activeStack: string | null;
}) {
  const stacks = getUniqueStacks(projects);

  if (stacks.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Filter projects by technology" className="flex flex-wrap gap-2">
      <FilterChip href="/portfolio" active={activeStack === null}>
        All
      </FilterChip>
      {stacks.map((stack) => (
        <FilterChip
          key={stack}
          href={`/portfolio?stack=${encodeURIComponent(stack)}`}
          active={activeStack === stack}
        >
          {stack}
        </FilterChip>
      ))}
    </nav>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
        active
          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
          : 'border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--foreground)]'
      }`}
      aria-current={active ? 'true' : undefined}
    >
      {children}
    </Link>
  );
}

/**
 * Collects unique stack values from all published projects, sorted
 * alphabetically and lowercased for consistent dedup.
 */
function getUniqueStacks(projects: Project[]): string[] {
  const seen = new Set<string>();
  for (const project of projects) {
    for (const technology of project.stack) {
      const normalized = technology.toLowerCase().trim();
      if (normalized) {
        seen.add(normalized);
      }
    }
  }
  return [...seen].sort();
}

/**
 * Filters a list of projects to those whose `stack` array includes
 * a value matching `stackName` (case-insensitive).
 */
export function filterProjectsByStack(projects: Project[], stackName: string): Project[] {
  const normalized = stackName.toLowerCase().trim();
  if (!normalized) {
    return projects;
  }
  return projects.filter((project) =>
    project.stack.some((technology) => technology.toLowerCase().trim() === normalized),
  );
}
