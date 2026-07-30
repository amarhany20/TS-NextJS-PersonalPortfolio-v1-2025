import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  const cache = <T extends (...args: any[]) => any>(fn: T) => {
    let hasValue = false;
    let cached: ReturnType<T>;
    return ((...args: Parameters<T>) => {
      if (!hasValue) {
        cached = fn(...args);
        hasValue = true;
      }
      return cached;
    }) as T;
  };

  return {
    ...actual,
    cache,
  };
});

vi.mock('@/server/repositories/SettingsRepository', () => ({
  SettingsRepository: {
    getStatus: vi.fn(),
  },
}));

vi.mock('@/server/services/EnvBootstrapService', () => ({
  EnvBootstrapService: {
    ensureSettingsAndAdmin: vi.fn(),
  },
}));

vi.mock('@/server/serializers/settings', () => ({
  serializeSettings: vi.fn((record: any) => ({
    hero: record.hero ?? {},
    contact: record.contact ?? {},
    profile: record.profile ?? { fullName: 'Ammar' },
    coreSkills: record.coreSkills ?? [],
    languages: record.languages ?? [],
    highlights: record.highlights ?? [],
    socialLinks: record.socialLinks ?? [],
    seo: record.seo ?? {
      title: 'Ammar',
      description: 'Portfolio',
      keywords: [],
    },
    theme: record.theme ?? { id: 'professional-dark' },
  })),
}));

import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { EnvBootstrapService } from '@/server/services/EnvBootstrapService';

let SettingsService: (typeof import('@/server/services/SettingsService'))['SettingsService'];

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ SettingsService } = await import('@/server/services/SettingsService'));
});

describe('SettingsService', () => {
  it('returns serialized site content', async () => {
    vi.mocked(SettingsRepository.getStatus).mockResolvedValue({
      status: 'ready',
      settings: { profile: { fullName: 'Ammar' } } as any,
    });

    const result = await SettingsService.getSiteContent();

    expect(result.profile?.fullName).toBe('Ammar');
    expect(SettingsRepository.getStatus).toHaveBeenCalledTimes(1);
  });

  it('caches consecutive calls', async () => {
    vi.mocked(SettingsRepository.getStatus).mockResolvedValue({
      status: 'ready',
      settings: { profile: { fullName: 'Cached' } } as any,
    });

    await SettingsService.getSiteContent();
    await SettingsService.getSiteContent();

    expect(SettingsRepository.getStatus).toHaveBeenCalledTimes(1);
  });

  it('bootstraps the settings row when the record is missing', async () => {
    vi.mocked(SettingsRepository.getStatus)
      .mockResolvedValueOnce({ status: 'missing_record' })
      .mockResolvedValueOnce({
        status: 'ready',
        settings: { profile: { fullName: 'Bootstrapped' } } as any,
      });

    await SettingsService.getSiteContent();

    expect(EnvBootstrapService.ensureSettingsAndAdmin).toHaveBeenCalledTimes(1);
    expect(SettingsRepository.getStatus).toHaveBeenCalledTimes(2);
  });

  it('throws when bootstrap leaves the record still missing', async () => {
    vi.mocked(SettingsRepository.getStatus)
      .mockResolvedValueOnce({ status: 'missing_record' })
      .mockResolvedValueOnce({ status: 'missing_record' });

    await expect(SettingsService.getSiteContent()).rejects.toThrow(
      'Settings bootstrap failed. Check your .env defaults.',
    );
  });
});
