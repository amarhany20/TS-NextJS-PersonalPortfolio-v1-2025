import { cache } from 'react';

import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { serializeSettings } from '@/server/serializers/settings';
import type { SiteContent } from '@/types/settings';
import { EnvBootstrapService } from '@/server/services/EnvBootstrapService';

type SetupStatusSummary = {
  setupCompletedAt: Date | null;
  setupVersion: string | null;
  databaseProvider: string | null;
} | null;

/**
 * Loads the public-facing site content, bootstrapping the settings row when the
 * database is initialized but still missing its first settings record.
 */
const fetchSiteContent = async (): Promise<SiteContent> => {
  const status = await SettingsRepository.getStatus();
  if (status.status === 'missing_table') {
    throw new Error('Database tables are missing. Run `npx prisma migrate deploy` to initialize them.');
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

export const SettingsService = {
  getSetupStatusSummary: cache(fetchSetupStatusSummary),
  getSiteContent: cache(fetchSiteContent),
};
