import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/PortfolioRepository', () => ({
  PortfolioRepository: {
    findPublished: vi.fn(),
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    isSlugTaken: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorderDisplayOrder: vi.fn(),
  },
}));

vi.mock('@/server/serializers/portfolio', () => ({
  serializeProject: vi.fn((record: any) => ({
    slug: record.slug,
    title: record.title ?? 'Title',
    tagline: record.tagline ?? 'Tagline',
    intro: record.intro ?? 'Intro',
    summary: record.summary ?? 'Summary',
    visibility: record.visibility ?? 'public',
    access: record.access ?? 'open-source',
    status: record.status ?? 'planning',
    role: record.role ?? 'Lead',
    start: '2024-01',
    stack: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })),
}));

import { NotFoundError } from '@/server/http/errors';
import { PortfolioRepository } from '@/server/repositories/PortfolioRepository';
import { serializeProject } from '@/server/serializers/portfolio';
import { PortfolioService } from '@/server/services/PortfolioService';
import type { CreateProjectInput } from '@/server/server-validators/api/portfolio';

const buildProject = (overrides: Partial<CreateProjectInput> = {}): CreateProjectInput => ({
  title: 'Test Project',
  slug: overrides.slug,
  tagline: 'Tagline',
  intro: 'Intro copy',
  summary: 'Summary copy',
  visibility: 'public',
  access: 'open-source',
  status: 'planning',
  domain: overrides.domain,
  company: overrides.company,
  client: overrides.client,
  website: overrides.website,
  repository: overrides.repository,
  role: 'Lead Engineer',
  start: '2024-01',
  end: overrides.end,
  stack: ['Node.js'],
  features: ['Speed'],
  sections: [],
  gallery: [],
  confidentialNotes: overrides.confidentialNotes,
  displayOrder: overrides.displayOrder,
  published: overrides.published,
  publishedAt: overrides.publishedAt,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PortfolioService', () => {
  it('returns published projects through the serializer', async () => {
    const records = [{ slug: 'example', title: 'Example' }] as unknown as Parameters<
      typeof serializeProject
    >[0][];
    vi.mocked(PortfolioRepository.findPublished).mockResolvedValue(records);
    vi.mocked(serializeProject).mockImplementation((record: any) => ({
      slug: record.slug,
      title: 'Title',
      tagline: 'Tagline',
      intro: 'Intro',
      summary: 'Summary',
      visibility: 'public',
      access: 'open-source',
      status: 'planning',
      role: 'Role',
      start: '2024-01',
      stack: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      marker: true,
    }));

    const result = await PortfolioService.getPublishedProjects();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ slug: 'example', marker: true });
    expect(PortfolioRepository.findPublished).toHaveBeenCalledTimes(1);
    const firstCall = vi.mocked(serializeProject).mock.calls[0];
    expect(firstCall?.[0]).toBe(records[0]);
  });

  it('creates a project with a slug derived from the title when none provided', async () => {
    vi.mocked(PortfolioRepository.isSlugTaken).mockResolvedValue(false);
    vi.mocked(PortfolioRepository.getNextDisplayOrder).mockResolvedValue(11);
    const created = { slug: 'test-project', serialized: false } as any;
    vi.mocked(PortfolioRepository.create).mockResolvedValue(created);
    vi.mocked(serializeProject).mockImplementation((record: any) => ({
      slug: record.slug,
      title: 'Title',
      tagline: 'Tagline',
      intro: 'Intro',
      summary: 'Summary',
      visibility: 'public',
      access: 'open-source',
      status: 'planning',
      role: 'Role',
      start: '2024-01',
      stack: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }));

    const result = await PortfolioService.createProject(buildProject());

    expect(PortfolioRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'test-project',
        displayOrder: 11,
        published: false,
        publishedAt: null,
      }),
    );
    expect(result).toMatchObject({ slug: 'test-project' });
  });

  it('throws when updating a project that does not exist', async () => {
    vi.mocked(PortfolioRepository.findBySlug).mockResolvedValue(null);

    await expect(
      PortfolioService.updateProject('missing', { title: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('propagates delete failure as not found', async () => {
    vi.mocked(PortfolioRepository.delete).mockResolvedValue(false);

    await expect(PortfolioService.deleteProject('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('reorders projects and appends unspecified slugs', async () => {
    const existing = [
      { slug: 'alpha', displayOrder: 1 },
      { slug: 'beta', displayOrder: 2 },
      { slug: 'gamma', displayOrder: 3 },
    ] as any;
    vi.mocked(PortfolioRepository.findAll).mockResolvedValue(existing);

    const result = await PortfolioService.reorderProjects(['beta', 'alpha']);

    expect(PortfolioRepository.reorderDisplayOrder).toHaveBeenCalledWith([
      { slug: 'beta', displayOrder: 1 },
      { slug: 'alpha', displayOrder: 2 },
      { slug: 'gamma', displayOrder: 3 },
    ]);
    expect(result).toEqual([
      { slug: 'beta', displayOrder: 1 },
      { slug: 'alpha', displayOrder: 2 },
      { slug: 'gamma', displayOrder: 3 },
    ]);
  });

  it('throws when unknown slugs are provided to reorder', async () => {
    const existing = [{ slug: 'alpha', displayOrder: 1 }] as any;
    vi.mocked(PortfolioRepository.findAll).mockResolvedValue(existing);

    await expect(PortfolioService.reorderProjects(['beta'])).rejects.toBeInstanceOf(NotFoundError);
    expect(PortfolioRepository.reorderDisplayOrder).not.toHaveBeenCalled();
  });
});
