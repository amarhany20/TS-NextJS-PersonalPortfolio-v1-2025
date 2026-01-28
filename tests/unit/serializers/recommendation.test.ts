import { describe, expect, it } from 'vitest';

import type { DbRecommendation } from '@/server/repositories/RecommendationRepository';
import { serializeRecommendation } from '@/server/serializers/recommendation';

describe('serializeRecommendation', () => {
  it('normalizes optional values and dates', () => {
    const record: DbRecommendation = {
      id: 'rec-1',
      name: 'Jane Doe',
      position: null,
      company: 'Example Co',
      relationship: null,
      content: 'Ammar delivers.',
      rating: null,
      linkedin: 'https://linkedin.com/in/example',
      recommendationLetterUrl: null,
      photo: null,
      receivedOn: new Date('2024-03-01T00:00:00Z'),
      displayOrder: 1,
      published: true,
      createdAt: new Date('2024-04-01T00:00:00Z'),
      updatedAt: new Date('2024-04-02T00:00:00Z'),
    };

    const result = serializeRecommendation(record);

    expect(result).toEqual({
      id: 'rec-1',
      name: 'Jane Doe',
      position: undefined,
      company: 'Example Co',
      relationship: undefined,
      content: 'Ammar delivers.',
      rating: undefined,
      linkedin: 'https://linkedin.com/in/example',
      recommendationLetterUrl: undefined,
      photo: undefined,
      date: '2024-03-01T00:00:00.000Z',
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: '2024-04-02T00:00:00.000Z',
    });
  });
});
