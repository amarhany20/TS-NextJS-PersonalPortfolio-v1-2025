import { describe, expect, it } from 'vitest';

import type { DbExperience } from '@/server/repositories/ExperienceRepository';
import { serializeExperience } from '../experience';

describe('serializeExperience', () => {
  it('derives impact and formats dates', () => {
    const record: DbExperience = {
      id: 'exp-1',
      company: 'Acme',
      title: 'Engineer',
      location: null,
      startDate: new Date('2023-01-01T00:00:00Z'),
      endDate: null,
      present: true,
      impact: ' ',
      achievements: ['Delivered results'],
      skills: ['TypeScript'],
      companyUrl: 'https://example.com',
      displayOrder: 1,
      published: true,
      createdAt: new Date('2023-02-01T00:00:00Z'),
      updatedAt: new Date('2023-03-01T00:00:00Z'),
    };

    const result = serializeExperience(record);

    expect(result.location).toBe('');
    expect(result.start).toBe('2023-01');
    expect(result.end).toBeUndefined();
    expect(result.present).toBe(true);
    expect(result.impact).toBe('Delivered results');
    expect(result.achievements).toEqual(['Delivered results']);
    expect(result.companyUrl).toBe('https://example.com');
    expect(result.createdAt).toBe('2023-02-01T00:00:00.000Z');
  });

  it('formats end date when present', () => {
    const record: DbExperience = {
      id: 'exp-2',
      company: 'Acme',
      title: 'Engineer',
      location: 'Remote',
      startDate: new Date('2022-01-01T00:00:00Z'),
      endDate: new Date('2022-06-01T00:00:00Z'),
      present: false,
      impact: 'Shipped features',
      achievements: ['Shipped features'],
      skills: ['Node.js'],
      companyUrl: null,
      displayOrder: 2,
      published: true,
      createdAt: new Date('2022-02-01T00:00:00Z'),
      updatedAt: new Date('2022-03-01T00:00:00Z'),
    };

    const result = serializeExperience(record);

    expect(result.end).toBe('2022-06');
    expect(result.companyUrl).toBeNull();
  });
});
