import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/RecommendationRepository', () => ({
  RecommendationRepository: {
    findPublished: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/recommendation', () => ({
  serializeRecommendation: vi.fn((record: any) => ({
    id: record.id ?? 'rec-1',
    name: record.name ?? 'Jane Doe',
    position: record.position ?? undefined,
    company: record.company ?? undefined,
    relationship: record.relationship ?? undefined,
    content: record.content ?? 'Great collaborator',
    rating: record.rating ?? undefined,
    linkedin: record.linkedin ?? undefined,
    recommendationLetterUrl: record.recommendationLetterUrl ?? undefined,
    photo: record.photo ?? undefined,
    date: record.receivedOn ? '2024-01-01T00:00:00.000Z' : undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })),
}));

import { NotFoundError, ValidationError } from '@/server/http/errors';
import { RecommendationRepository } from '@/server/repositories/RecommendationRepository';
import { serializeRecommendation } from '@/server/serializers/recommendation';
import { RecommendationService } from '@/server/services/RecommendationService';
import type { CreateRecommendationInput } from '@/server/server-validators/api/recommendation';

const buildRecommendation = (
  overrides: Partial<CreateRecommendationInput> = {},
): CreateRecommendationInput => ({
  name: overrides.name ?? 'Jane Doe',
  position: overrides.position,
  company: overrides.company,
  relationship: overrides.relationship,
  content: overrides.content ?? 'Delivered impact quickly',
  rating: overrides.rating,
  linkedin: overrides.linkedin,
  recommendationLetterUrl: overrides.recommendationLetterUrl,
  photo: overrides.photo,
  receivedOn: overrides.receivedOn,
  displayOrder: overrides.displayOrder,
  published: overrides.published,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('RecommendationService', () => {
  it('maps published recommendations through serializer', async () => {
    const records = [{ id: 'rec-1', name: 'Ref' }] as unknown as Parameters<
      typeof serializeRecommendation
    >[0][];
    vi.mocked(RecommendationRepository.findPublished).mockResolvedValue(records);

    const result = await RecommendationService.getRecommendations();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ name: 'Ref' });
  });

  it('validates receivedOn when provided', async () => {
    await expect(
      RecommendationService.createRecommendation(buildRecommendation({ receivedOn: 'bad-date' })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError when deleting missing recommendation', async () => {
    vi.mocked(RecommendationRepository.delete).mockResolvedValue(false);

    await expect(RecommendationService.deleteRecommendation('missing')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
