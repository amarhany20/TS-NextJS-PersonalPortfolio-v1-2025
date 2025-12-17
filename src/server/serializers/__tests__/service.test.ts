import { describe, expect, it } from 'vitest';

import type { DbService } from '@/server/repositories/ServiceRepository';
import { serializeService } from '../service';

describe('serializeService', () => {
  it('maps db fields to ui service shape', () => {
    const record: DbService = {
      id: 'svc-1',
      slug: 'fractional-engineering',
      title: 'Fractional Engineering',
      description: 'Ship product faster',
      longDescription: null,
      features: ['Discovery'],
      technologies: ['Next.js'],
      icon: null,
      image: '/service.png',
      active: true,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = serializeService(record);

    expect(result).toEqual({
      id: 'svc-1',
      slug: 'fractional-engineering',
      title: 'Fractional Engineering',
      description: 'Ship product faster',
      longDescription: undefined,
      features: ['Discovery'],
      technologies: ['Next.js'],
      icon: undefined,
      image: '/service.png',
      active: true,
      displayOrder: 1,
    });
  });
});
