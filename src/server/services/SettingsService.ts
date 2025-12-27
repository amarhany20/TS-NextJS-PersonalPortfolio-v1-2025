import { cache } from 'react';

import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { SetupRequiredError } from '@/server/http/errors';
import { serializeSettings } from '@/server/serializers/settings';
import type { SiteContent } from '@/types/settings';

const fetchSiteContent = async (): Promise<SiteContent> => {
  const status = await SettingsRepository.getStatus();
  if (status.status === 'missing_table') {
    throw new SetupRequiredError('SETUP_REQUIRED: Database is not initialised (missing tables).', {
      hint: 'Run Prisma migrations and seed the database.',
      commands: ['npx prisma migrate dev', 'npm run db:seed'],
    });
  }

  if (status.status === 'missing_record') {
    throw new SetupRequiredError('SETUP_REQUIRED: Site settings have not been initialised.', {
      hint: 'Seed the database or run the first-run setup wizard.',
      commands: ['npm run db:seed', 'pnpm run setup:first-run'],
    });
  }

  return serializeSettings(status.settings);
};

export const SettingsService = {
  getSiteContent: cache(fetchSiteContent),
};
