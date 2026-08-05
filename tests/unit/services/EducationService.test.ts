import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/EducationRepository', () => ({
  EducationRepository: {
    findPublished: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/education', () => ({
  serializeEducation: vi.fn((record: any) => ({
    id: record.id ?? 'edu-1',
    institution: record.institution ?? 'Uni',
    degree: record.degree ?? 'BSc',
    field: record.field ?? undefined,
    location: record.location ?? undefined,
    start: '2024-01',
    end: record.endDate ? '2024-06' : undefined,
    present: Boolean(record.present),
    gpa: record.gpa ?? undefined,
    achievements: record.achievements ?? [],
    project: record.project ?? undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })),
}));

import { NotFoundError, ValidationError } from '@/server/http/errors';
import { EducationRepository } from '@/server/repositories/EducationRepository';
import { serializeEducation } from '@/server/serializers/education';
import { EducationService } from '@/server/services/EducationService';
import type { CreateEducationInput } from '@/server/server-validators/api/education';

type Overrides = Partial<CreateEducationInput>;

const buildEducation = (overrides: Overrides = {}): CreateEducationInput => ({
  institution: overrides.institution ?? 'University',
  degree: overrides.degree ?? 'BSc Computer Science',
  field: overrides.field,
  location: overrides.location,
  start: overrides.start ?? '2020-09',
  end: overrides.end,
  present: overrides.present,
  gpa: overrides.gpa,
  achievements: overrides.achievements ?? ['Graduated with honors'],
  project: overrides.project,
  displayOrder: overrides.displayOrder,
  published: overrides.published,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('EducationService', () => {
  it('validates start date when creating education entry', async () => {
    await expect(
      EducationService.createEducation(buildEducation({ start: 'Sept 2020' })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('maps published education entries through serializer', async () => {
    const records = [{ id: 'edu-1', institution: 'Uni' }] as unknown as Parameters<
      typeof serializeEducation
    >[0][];
    vi.mocked(EducationRepository.findPublished).mockResolvedValue(records);

    const result = await EducationService.getPublishedEducation();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ institution: 'Uni' });
    expect(EducationRepository.findPublished).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundError when updating non-existent record', async () => {
    vi.mocked(EducationRepository.findById).mockResolvedValue(null);

    await expect(
      EducationService.updateEducation('missing', { institution: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError when delete fails', async () => {
    vi.mocked(EducationRepository.delete).mockResolvedValue(false);

    await expect(EducationService.deleteEducation('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});
