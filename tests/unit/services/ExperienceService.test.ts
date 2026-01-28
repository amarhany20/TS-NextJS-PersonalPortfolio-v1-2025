import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/ExperienceRepository', () => ({
  ExperienceRepository: {
    findPublished: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/experience', () => ({
  serializeExperience: vi.fn((record: any) => ({
    id: record.id ?? '1',
    company: record.company ?? 'Acme',
    title: record.title ?? 'Engineer',
    location: record.location ?? 'Remote',
    start: '2024-01',
    end: record.endDate ? '2024-06' : undefined,
    present: Boolean(record.present),
    impact: record.impact ?? 'Impact',
    achievements: record.achievements ?? [],
    skills: record.skills ?? [],
    companyUrl: record.companyUrl ?? null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })),
}));

import { NotFoundError, ValidationError } from '@/server/http/errors';
import { ExperienceRepository } from '@/server/repositories/ExperienceRepository';
import { serializeExperience } from '@/server/serializers/experience';
import { ExperienceService } from '@/server/services/ExperienceService';
import type { CreateExperienceInput } from '@/server/server-validators/api/experience';

type CreateInputOverrides = Partial<CreateExperienceInput>;

const buildExperience = (overrides: CreateInputOverrides = {}): CreateExperienceInput => ({
  id: overrides.id,
  company: overrides.company ?? 'Acme Co',
  title: overrides.title ?? 'Engineer',
  location: overrides.location ?? 'Remote',
  start: overrides.start ?? '2024-01',
  end: overrides.end,
  present: overrides.present,
  impact: overrides.impact ?? 'Built awesome features',
  achievements: overrides.achievements ?? ['Shipped project'],
  skills: overrides.skills ?? ['TypeScript'],
  companyUrl: overrides.companyUrl,
  displayOrder: overrides.displayOrder,
  published: overrides.published,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ExperienceService', () => {
  it('rejects creation with malformed start date', async () => {
    await expect(
      ExperienceService.createExperience(buildExperience({ start: '202401' })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('maps published experience through serializer', async () => {
    const records = [{ id: '1', company: 'Acme' }] as unknown as Parameters<typeof serializeExperience>[0][];
    vi.mocked(ExperienceRepository.findPublished).mockResolvedValue(records);

    const result = await ExperienceService.getPublishedExperience();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ company: 'Acme' });
    expect(ExperienceRepository.findPublished).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundError when updating non-existent entry', async () => {
    vi.mocked(ExperienceRepository.findById).mockResolvedValue(null);

    await expect(
      ExperienceService.updateExperience('missing', { title: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError when delete returns false', async () => {
    vi.mocked(ExperienceRepository.delete).mockResolvedValue(false);

    await expect(ExperienceService.deleteExperience('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});
