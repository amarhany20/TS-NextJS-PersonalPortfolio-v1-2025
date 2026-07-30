import { cache } from 'react';

import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { serializeSettings } from '@/server/serializers/settings';
import type {
  UpdateSiteProfileInput,
  UpdateSiteVisibilityInput,
} from '@/server/server-validators/settings';
import type { SiteContent, SiteVisibility } from '@/types/settings';
import { EnvBootstrapService } from '@/server/services/EnvBootstrapService';

type SetupStatusSummary = {
  setupCompletedAt: Date | null;
  setupVersion: string | null;
  databaseProvider: string | null;
} | null;

export interface SiteProfileSettings {
  siteTitle: string;
  siteSubtitle: string;
  heroGreeting: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryEmail: string;
  secondaryEmail: string;
  location: string;
  timezone: string;
}

export type SiteVisibilitySettings = SiteVisibility;

function toSiteProfileSettings(
  settings: NonNullable<Awaited<ReturnType<typeof SettingsRepository.get>>>,
) {
  return {
    siteTitle: settings.siteTitle,
    siteSubtitle: settings.siteSubtitle ?? '',
    heroGreeting: settings.heroGreeting ?? '',
    heroSubtitle: settings.heroSubtitle ?? '',
    heroDescription: settings.heroDescription ?? '',
    primaryEmail: settings.primaryEmail ?? '',
    secondaryEmail: settings.secondaryEmail ?? '',
    location: settings.location ?? '',
    timezone: settings.timezone ?? '',
  } satisfies SiteProfileSettings;
}

function toSiteVisibilitySettings(
  settings: NonNullable<Awaited<ReturnType<typeof SettingsRepository.get>>>,
) {
  return serializeSettings(settings).visibility;
}

/**
 * Loads the public-facing site content, bootstrapping the settings row when the
 * database is initialized but still missing its first settings record.
 */
const fetchSiteContent = async (): Promise<SiteContent> => {
  const status = await SettingsRepository.getStatus();
  if (status.status === 'missing_table') {
    throw new Error(
      'Database tables are missing. Run `npx prisma migrate deploy` to initialize them.',
    );
  }

  if (status.status === 'missing_record') {
    await EnvBootstrapService.ensureSettingsAndAdmin();
    const refreshed = await SettingsRepository.getStatus();
    if (refreshed.status !== 'ready') {
      throw new Error('Settings bootstrap failed. Check your .env defaults.');
    }
    return serializeSettings(refreshed.settings);
  }

  return serializeSettings(status.settings);
};

/**
 * Returns a minimal setup summary for admin diagnostics without triggering
 * bootstrap side effects when the settings row is absent.
 */
const fetchSetupStatusSummary = async (): Promise<SetupStatusSummary> => {
  const settings = await SettingsRepository.get();

  if (!settings) {
    return null;
  }

  return {
    setupCompletedAt: settings.setupCompletedAt ?? null,
    setupVersion: settings.setupVersion ?? null,
    databaseProvider: settings.databaseProvider ?? null,
  };
};

const fetchProfileSettings = async (): Promise<SiteProfileSettings> => {
  const status = await SettingsRepository.getStatus();

  if (status.status === 'missing_table') {
    throw new Error(
      'Database tables are missing. Run `npx prisma migrate deploy` to initialize them.',
    );
  }

  if (status.status === 'missing_record') {
    await EnvBootstrapService.ensureSettingsAndAdmin();
    const refreshed = await SettingsRepository.getStatus();
    if (refreshed.status !== 'ready') {
      throw new Error('Settings bootstrap failed. Check your .env defaults.');
    }
    return toSiteProfileSettings(refreshed.settings);
  }

  return toSiteProfileSettings(status.settings);
};

const fetchVisibilitySettings = async (): Promise<SiteVisibilitySettings> => {
  const status = await SettingsRepository.getStatus();

  if (status.status === 'missing_table') {
    throw new Error(
      'Database tables are missing. Run `npx prisma migrate deploy` to initialize them.',
    );
  }

  if (status.status === 'missing_record') {
    await EnvBootstrapService.ensureSettingsAndAdmin();
    const refreshed = await SettingsRepository.getStatus();
    if (refreshed.status !== 'ready') {
      throw new Error('Settings bootstrap failed. Check your .env defaults.');
    }
    return toSiteVisibilitySettings(refreshed.settings);
  }

  return toSiteVisibilitySettings(status.settings);
};

export const SettingsService = {
  getSetupStatusSummary: cache(fetchSetupStatusSummary),
  getProfileSettings: cache(fetchProfileSettings),
  getVisibilitySettings: cache(fetchVisibilitySettings),
  getSiteContent: cache(fetchSiteContent),
  updateSiteProfile: async (input: UpdateSiteProfileInput) => {
    const settings = await SettingsRepository.updateSiteProfile(input);
    return toSiteProfileSettings(settings);
  },
  updateSiteVisibility: async (input: UpdateSiteVisibilityInput) => {
    const settings = await SettingsRepository.updateSiteVisibility(input);
    return toSiteVisibilitySettings(settings);
  },
};
