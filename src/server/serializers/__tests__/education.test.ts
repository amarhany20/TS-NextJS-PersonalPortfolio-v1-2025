import { describe, expect, it } from 'vitest';

import type { DbEducation } from '@/server/repositories/EducationRepository';
import { serializeEducation } from '../education';

describe('serializeEducation', () => {
  it('formats dates and strips nullable fields', () => {
    const record: DbEducation = {
      id: 'edu-1',
      institution: 'Example University',
      degree: 'BSc Computer Science',
      field: null,
      location: 'Remote',
      startDate: new Date('2019-09-01T00:00:00Z'),
      endDate: new Date('2023-06-01T00:00:00Z'),
      present: false,
      gpa: null,
      achievements: ['Dean list'],
      project: 'Thesis',
      displayOrder: 1,
      published: true,
      createdAt: new Date('2023-07-01T00:00:00Z'),
      updatedAt: new Date('2023-07-02T00:00:00Z'),
    };

    const result = serializeEducation(record);

    expect(result.start).toBe('2019-09');
    expect(result.end).toBe('2023-06');
    expect(result.field).toBeUndefined();
    expect(result.gpa).toBeUndefined();
    expect(result.project).toBe('Thesis');
  });

  it('handles ongoing education gracefully', () => {
    const record: DbEducation = {
      id: 'edu-2',
      institution: 'Example University',
      degree: 'MSc Computer Science',
      field: 'AI',
      location: null,
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: null,
      present: true,
      gpa: '4.0',
      achievements: [],
      project: null,
      displayOrder: 2,
      published: true,
      createdAt: new Date('2024-02-01T00:00:00Z'),
      updatedAt: new Date('2024-02-02T00:00:00Z'),
    };

    const result = serializeEducation(record);

    expect(result.end).toBeUndefined();
    expect(result.location).toBeUndefined();
    expect(result.gpa).toBe('4.0');
  });
});
