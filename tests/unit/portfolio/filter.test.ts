import { describe, expect, it } from 'vitest';

import { filterProjectsByStack } from '@/components/Portfolio/StackFilterBar';
import type { Project } from '@/types/portfolio';

const makeProject = (overrides: Partial<Project>): Project => ({
  slug: overrides.slug ?? 'test',
  title: overrides.title ?? 'Test',
  tagline: overrides.tagline ?? '',
  intro: overrides.intro ?? '',
  summary: overrides.summary ?? '',
  featured: overrides.featured ?? false,
  visibility: (overrides.visibility as Project['visibility']) ?? 'public',
  access: (overrides.access as Project['access']) ?? 'client-owned',
  status: (overrides.status as Project['status']) ?? 'live',
  role: overrides.role ?? 'Engineer',
  start: overrides.start ?? '2025-01',
  end: overrides.end,
  stack: overrides.stack ?? [],
  displayOrder: overrides.displayOrder ?? 0,
  published: overrides.published ?? true,
  publishedAt: overrides.publishedAt ?? '2025-06-01T00:00:00.000Z',
  createdAt: overrides.createdAt ?? '2025-01-01T00:00:00.000Z',
  updatedAt: overrides.updatedAt ?? '2025-06-01T00:00:00.000Z',
});

const sampleProjects: Project[] = [
  makeProject({ slug: 'p1', stack: ['next.js', 'typescript'] }),
  makeProject({ slug: 'p2', stack: ['react', 'tailwind'] }),
  makeProject({ slug: 'p3', stack: ['next.js', 'react', 'prisma'] }),
  makeProject({ slug: 'p4', stack: [] }),
];

describe('filterProjectsByStack', () => {
  it('returns all projects when the stack name is empty', () => {
    expect(filterProjectsByStack(sampleProjects, '')).toHaveLength(4);
  });

  it('filters projects whose stack includes the given value', () => {
    const result = filterProjectsByStack(sampleProjects, 'next.js');
    expect(result.map((p) => p.slug)).toEqual(['p1', 'p3']);
  });

  it('is case-insensitive', () => {
    const result = filterProjectsByStack(sampleProjects, 'NEXT.JS');
    expect(result.map((p) => p.slug)).toEqual(['p1', 'p3']);
  });

  it('trims whitespace', () => {
    const result = filterProjectsByStack(sampleProjects, '  react  ');
    expect(result.map((p) => p.slug)).toEqual(['p2', 'p3']);
  });

  it('returns empty array when no projects match', () => {
    const result = filterProjectsByStack(sampleProjects, 'vue');
    expect(result).toHaveLength(0);
  });

  it('excludes projects with no stack', () => {
    const result = filterProjectsByStack(sampleProjects, 'typescript');
    expect(result.map((p) => p.slug)).toEqual(['p1']);
  });
});
