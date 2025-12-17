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
    get: vi.fn(),
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

let SettingsService: typeof import('../SettingsService')['SettingsService'];

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ SettingsService } = await import('../SettingsService'));
});

describe('SettingsService', () => {
  it('returns serialized site content', async () => {
    vi.mocked(SettingsRepository.get).mockResolvedValue({ profile: { fullName: 'Ammar' } } as any);

    const result = await SettingsService.getSiteContent();

    expect(result.profile?.fullName).toBe('Ammar');
    expect(SettingsRepository.get).toHaveBeenCalledTimes(1);
  });

  it('caches consecutive calls', async () => {
    vi.mocked(SettingsRepository.get).mockResolvedValue({ profile: { fullName: 'Cached' } } as any);

    await SettingsService.getSiteContent();
    await SettingsService.getSiteContent();

    expect(SettingsRepository.get).toHaveBeenCalledTimes(1);
  });

  it('throws when settings missing', async () => {
    vi.mocked(SettingsRepository.get).mockResolvedValue(null);

    await expect(SettingsService.getSiteContent()).rejects.toThrow('Site settings have not been initialised');
  });
});
