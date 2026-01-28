import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/SkillRepository', () => ({
  SkillRepository: {
    findAllGroups: vi.fn(),
    findBySlug: vi.fn(),
    isSlugTaken: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    createGroup: vi.fn(),
    updateGroup: vi.fn(),
    deleteGroup: vi.fn(),
  },
}));

vi.mock('@/server/serializers/skill', () => ({
  serializeSkillGroup: vi.fn((group: any) => ({
    id: group.slug ?? 'skills',
    title: group.title ?? 'Skills',
    summary: group.summary ?? undefined,
    skills: Array.isArray(group.skills)
      ? group.skills.map((skill: any) => ({ name: skill.name }))
      : [],
  })),
}));

import { NotFoundError } from '@/server/http/errors';
import { SkillRepository } from '@/server/repositories/SkillRepository';
import { SkillService } from '@/server/services/SkillService';
import type { CreateSkillGroupInput } from '@/server/server-validators/api/skill';

const buildGroup = (overrides: Partial<CreateSkillGroupInput> = {}): CreateSkillGroupInput => ({
  slug: overrides.slug,
  title: overrides.title ?? 'Platform',
  summary: overrides.summary,
  displayOrder: overrides.displayOrder,
  skills: overrides.skills ?? [
    { id: 'ts', name: 'TypeScript', displayOrder: 0 },
  ],
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SkillService', () => {
  it('creates skill group with generated slug when missing', async () => {
    vi.mocked(SkillRepository.isSlugTaken).mockResolvedValue(false);
    vi.mocked(SkillRepository.getNextDisplayOrder).mockResolvedValue(3);
    vi.mocked(SkillRepository.createGroup).mockResolvedValue({
      slug: 'platform',
      title: 'Platform',
      summary: null,
      displayOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
      id: 'group-1',
    } as any);

    const result = await SkillService.createSkillGroup(buildGroup({ slug: undefined }));

    expect(SkillRepository.createGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'platform',
        displayOrder: 3,
      }),
    );
    expect(result).toMatchObject({ id: 'platform', title: 'Platform' });
  });

  it('throws NotFoundError when updating missing group', async () => {
    vi.mocked(SkillRepository.findBySlug).mockResolvedValue(null);

    await expect(
      SkillService.updateSkillGroup('missing', { title: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError when delete fails', async () => {
    vi.mocked(SkillRepository.deleteGroup).mockResolvedValue(false);

    await expect(SkillService.deleteSkillGroup('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('regenerates slug when requested change collides', async () => {
    vi.mocked(SkillRepository.findBySlug).mockResolvedValue({
      id: 'existing',
      slug: 'platform',
      title: 'Platform',
      summary: null,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
    } as any);
    vi.mocked(SkillRepository.isSlugTaken)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    vi.mocked(SkillRepository.updateGroup).mockResolvedValue({
      id: 'existing',
      slug: 'platform-2',
      title: 'Updated',
      summary: null,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
    } as any);

    const result = await SkillService.updateSkillGroup('platform', { slug: 'platform', title: 'Updated' });

    expect(SkillRepository.updateGroup).toHaveBeenCalledWith('platform', expect.objectContaining({ slug: 'platform-2' }));
  expect(result.id).toBe('platform-2');
  });
});
