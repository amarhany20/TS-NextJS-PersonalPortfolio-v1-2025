import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/ServiceRepository', () => ({
  ServiceRepository: {
    findActive: vi.fn(),
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    isSlugTaken: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorderDisplayOrder: vi.fn(),
  },
}));

vi.mock('@/server/serializers/service', () => ({
  serializeService: vi.fn((record: any) => ({
    id: record.id ?? 'svc-1',
    slug: record.slug ?? 'service',
    title: record.title ?? 'Service',
    description: record.description ?? 'Desc',
    longDescription: record.longDescription ?? undefined,
    features: record.features ?? [],
    technologies: record.technologies ?? [],
    icon: record.icon ?? undefined,
    image: record.image ?? undefined,
    active: record.active ?? true,
  })),
}));

import { ConflictError, NotFoundError } from '@/server/http/errors';
import { ServiceRepository } from '@/server/repositories/ServiceRepository';
import { serializeService } from '@/server/serializers/service';
import { ServiceService } from '@/server/services/ServiceService';
import type { CreateServiceInput } from '@/server/server-validators/api/service';

const buildService = (overrides: Partial<CreateServiceInput> = {}): CreateServiceInput => ({
  title: overrides.title ?? 'Fractional Engineering',
  slug: overrides.slug,
  description: overrides.description ?? 'Build shipping velocity fast.',
  longDescription: overrides.longDescription,
  features: overrides.features ?? ['Discovery', 'Delivery'],
  technologies: overrides.technologies ?? ['Next.js'],
  icon: overrides.icon,
  image: overrides.image,
  active: overrides.active,
  displayOrder: overrides.displayOrder,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ServiceService', () => {
  it('creates a service with a deduplicated slug', async () => {
    vi.mocked(ServiceRepository.isSlugTaken)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    vi.mocked(ServiceRepository.getNextDisplayOrder).mockResolvedValue(5);
    const created = { slug: 'fractional-engineering-2' } as any;
    vi.mocked(ServiceRepository.create).mockResolvedValue(created);
    vi.mocked(serializeService).mockImplementation((record: any) => ({
      id: 'svc-1',
      slug: record.slug,
      title: 'Fractional Engineering',
      description: 'Desc',
      features: record.features ?? [],
      technologies: record.technologies ?? [],
      active: record.active ?? true,
    }));

    const result = await ServiceService.createService(
      buildService({ title: 'Fractional Engineering' }),
    );

    expect(ServiceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'fractional-engineering-2',
        displayOrder: 5,
        active: true,
      }),
    );
    expect(result.slug).toBe('fractional-engineering-2');
  });

  it('throws NotFoundError when updating missing service', async () => {
    vi.mocked(ServiceRepository.findBySlug).mockResolvedValue(null);

    await expect(
      ServiceService.updateService('missing', { title: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError when delete indicates missing record', async () => {
    vi.mocked(ServiceRepository.delete).mockResolvedValue(false);

    await expect(ServiceService.deleteService('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('bubbles unique slug exhaustion as ConflictError', async () => {
    vi.mocked(ServiceRepository.isSlugTaken).mockResolvedValue(true);

    await expect(ServiceService.createService(buildService({ title: 'X' }))).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('reorders services and normalizes displayOrder values', async () => {
    vi.mocked(ServiceRepository.findAll).mockResolvedValue([
      { slug: 'service-a', displayOrder: 1 } as any,
      { slug: 'service-b', displayOrder: 2 } as any,
      { slug: 'service-c', displayOrder: 3 } as any,
    ]);

    await ServiceService.reorderServices(['service-c', 'service-a', 'service-b']);

    expect(ServiceRepository.reorderDisplayOrder).toHaveBeenCalledWith([
      { slug: 'service-c', displayOrder: 1 },
      { slug: 'service-a', displayOrder: 2 },
      { slug: 'service-b', displayOrder: 3 },
    ]);
  });

  it('throws when unknown slugs are provided for reorder', async () => {
    vi.mocked(ServiceRepository.findAll).mockResolvedValue([
      { slug: 'known-service', displayOrder: 1 } as any,
    ]);

    await expect(ServiceService.reorderServices(['missing-service'])).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
