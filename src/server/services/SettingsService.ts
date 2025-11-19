import { cache } from 'react';

import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { serializeSettings } from '@/server/serializers/settings';
import type { SiteContent } from '@/types/settings';

const fetchSiteContent = async (): Promise<SiteContent> => {
  const settings = await SettingsRepository.get();
  if (!settings) {
    throw new Error('Site settings have not been initialised. Run the seed script or complete setup.');
  }

  return serializeSettings(settings);
};

export const SettingsService = {
  getSiteContent: cache(fetchSiteContent),
};
