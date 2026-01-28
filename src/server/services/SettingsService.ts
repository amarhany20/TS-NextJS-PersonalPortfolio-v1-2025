import { cache } from 'react';

import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { serializeSettings } from '@/server/serializers/settings';
import type { SiteContent } from '@/types/settings';
import { EnvBootstrapService } from '@/server/services/EnvBootstrapService';


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

export const SettingsService = {
  getSiteContent: cache(fetchSiteContent),
};
