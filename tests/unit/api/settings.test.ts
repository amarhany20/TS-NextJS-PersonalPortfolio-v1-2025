import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import { UnauthorizedError } from '@/server/http/errors';

vi.mock('@/server/services/SettingsService', () => ({
  SettingsService: {
    updateSiteProfile: vi.fn(),
    updateSiteVisibility: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const { SettingsService } = await import('@/server/services/SettingsService');
const { requireAuth } = await import('@/server/security/session');

import { PATCH as patchProfile } from '@/app/api/v1/settings/profile/route';
import { PATCH as patchVisibility } from '@/app/api/v1/settings/visibility/route';
import { createRequest } from './helpers';

afterEach(() => {
  vi.clearAllMocks();
});

describe('settings api routes', () => {
  it('profile PATCH requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await patchProfile(
      createRequest('/api/v1/settings/profile', 'PATCH', { siteTitle: 'Ammar Hany' }),
    );

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(SettingsService.updateSiteProfile).not.toHaveBeenCalled();
  });

  it('profile PATCH rejects a payload without siteTitle', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});

    const response = await patchProfile(createRequest('/api/v1/settings/profile', 'PATCH', {}));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe('VALIDATION_ERROR');
  });

  it('profile PATCH updates the site profile', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (SettingsService.updateSiteProfile as unknown as Mock).mockResolvedValue({
      siteTitle: 'Ammar Hany',
    });

    const profileBody = {
      siteTitle: 'Ammar Hany',
      siteSubtitle: 'Full-Stack Engineer',
      heroGreeting: 'Hello',
      heroSubtitle: 'Welcome to my portfolio',
      heroDescription: 'A short hero description.',
      primaryEmail: 'ammar@example.com',
      secondaryEmail: '',
      location: 'Cairo',
      timezone: 'Africa/Cairo',
      photoUrl: '',
    };

    const response = await patchProfile(
      createRequest('/api/v1/settings/profile', 'PATCH', profileBody),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(SettingsService.updateSiteProfile).toHaveBeenCalledTimes(1);
  });

  it('visibility PATCH rejects a payload missing pages', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});

    const response = await patchVisibility(
      createRequest('/api/v1/settings/visibility', 'PATCH', { pages: {} }),
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(SettingsService.updateSiteVisibility).not.toHaveBeenCalled();
  });

  it('visibility PATCH updates visibility toggles', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (SettingsService.updateSiteVisibility as unknown as Mock).mockResolvedValue({
      pages: { portfolio: true, services: true, blogs: true },
    });

    const visibilityBody = {
      pages: { portfolio: true, services: true, blogs: true },
      sections: {
        summary: true,
        experience: true,
        education: true,
        certificates: true,
        recommendations: true,
        skills: true,
        contact: true,
      },
    };

    const response = await patchVisibility(
      createRequest('/api/v1/settings/visibility', 'PATCH', visibilityBody),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(SettingsService.updateSiteVisibility).toHaveBeenCalledTimes(1);
  });
});
