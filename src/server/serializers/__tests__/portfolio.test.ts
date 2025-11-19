import { describe, expect, it } from 'vitest';

import type { DbPortfolioProject } from '@/server/repositories/PortfolioRepository';
import { serializeProject } from '../portfolio';

const baseRecord = (): DbPortfolioProject => ({
  id: '1',
  slug: 'my-project',
  title: 'My Project',
  tagline: 'Delivering value',
  intro: 'Intro copy',
  summary: 'Summary copy',
  featured: true,
  visibility: 'public',
  access: 'open-source',
  status: 'live',
  domain: null,
  company: null,
  client: null,
  website: 'https://example.com',
  repository: 'https://github.com/example',
  role: 'Lead Engineer',
  startDate: new Date('2022-01-01T00:00:00Z'),
  endDate: null,
  stack: ['TypeScript', 'Next.js'],
  features: ['Fast'],
  sections: [
    { id: 'two', title: 'Second', body: 'Details', order: 2 },
    { id: 'one', title: 'First', body: 'Overview', order: 1 },
  ],
  gallery: [
    { id: 'g1', image: '/hero.png', alt: 'Hero', title: 'Hero' },
    { placeholder: true },
  ],
  confidentialNotes: null,
  displayOrder: 1,
  published: true,
  publishedAt: new Date('2022-02-01T00:00:00Z'),
  createdAt: new Date('2022-03-01T00:00:00Z'),
  updatedAt: new Date('2022-03-02T00:00:00Z'),
});

describe('serializeProject', () => {
  it('normalizes portfolio records into UI-friendly projects', () => {
    const result = serializeProject(baseRecord());

    expect(result.slug).toBe('my-project');
    expect(result.start).toBe('2022-01');
    expect(result.end).toBeUndefined();
    expect(result.repository).toBe('https://github.com/example');
    expect(result.domain).toBeUndefined();
    expect(result.sections).toBeDefined();
    expect(result.sections?.map((section) => section.id)).toEqual(['one', 'two']);
    expect(result.gallery).toHaveLength(1);
    expect(result.gallery?.[0].image).toBe('/hero.png');
    expect(result.createdAt).toBe('2022-03-01T00:00:00.000Z');
  });
});
