/**
 * SettingsRepository
 *
 * Provides access to the singleton settings row.
 */

import type { Settings as PrismaSettingsRecord } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import prisma from '@/server/db/prisma';
import type {
  UpdateSiteProfileInput,
  UpdateSiteVisibilityInput,
} from '@/server/server-validators/settings';
import { parseJson } from '@/server/server-utils/json';
import { logger } from '@/utils/logger';

export interface DbSettings {
  id: string;
  siteTitle: string;
  siteSubtitle?: string | null;
  heroGreeting?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  primaryEmail?: string | null;
  secondaryEmail?: string | null;
  location?: string | null;
  timezone?: string | null;
  theme: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string | null;
  socialLinks: Array<Record<string, unknown>>;
  heroButtons: Record<string, unknown> | null;
  contactConfig: Record<string, unknown> | null;
  seoDefaults: Record<string, unknown> | null;
  setupCompletedAt?: Date | null;
  setupVersion?: string | null;
  databaseProvider?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SettingsStatus =
  | { status: 'ready'; settings: DbSettings }
  | { status: 'missing_table' }
  | { status: 'missing_record' };

const SETTINGS_ID = 'settings-singleton';

function mapSettingsRecord(record: PrismaSettingsRecord): DbSettings {
  return {
    id: record.id,
    siteTitle: record.siteTitle,
    siteSubtitle: record.siteSubtitle,
    heroGreeting: record.heroGreeting,
    heroSubtitle: record.heroSubtitle,
    heroDescription: record.heroDescription,
    primaryEmail: record.primaryEmail,
    secondaryEmail: record.secondaryEmail,
    location: record.location,
    timezone: record.timezone,
    theme: record.theme,
    maintenanceMode: record.maintenanceMode,
    maintenanceMessage: record.maintenanceMessage,
    socialLinks: parseJson(record.socialLinks, [] as Array<Record<string, unknown>>),
    heroButtons: parseJson<Record<string, unknown> | null>(record.heroButtons, null),
    contactConfig: parseJson<Record<string, unknown> | null>(record.contactConfig, null),
    seoDefaults: parseJson<Record<string, unknown> | null>(record.seoDefaults, null),
    setupCompletedAt: record.setupCompletedAt,
    setupVersion: record.setupVersion,
    databaseProvider: record.databaseProvider,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const SettingsRepository = {
  async getStatus(): Promise<SettingsStatus> {
    try {
      const record = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
      if (!record) {
        return { status: 'missing_record' };
      }

      return { status: 'ready', settings: mapSettingsRecord(record) };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2021') {
        logger.warn(
          'Settings table missing. Run `npx prisma migrate dev` (local) or `npx prisma migrate deploy` (prod) to initialise the database.',
        );
        return { status: 'missing_table' };
      }

      throw error;
    }
  },

  async get(): Promise<DbSettings | null> {
    let record;
    try {
      record = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2021') {
        logger.warn(
          'Settings table missing. Run `npx prisma db push` or migrations to initialise the database.',
        );
        return null;
      }

      throw error;
    }

    if (!record) {
      return null;
    }

    return mapSettingsRecord(record);
  },

  async setTheme(themeId: string) {
    try {
      await prisma.settings.update({
        where: { id: SETTINGS_ID },
        data: { theme: themeId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(
          'Settings record not initialised. Ensure .env bootstrap has run and database is migrated.',
        );
      }

      throw error;
    }
  },

  async updateSiteProfile(input: UpdateSiteProfileInput): Promise<DbSettings> {
    try {
      const record = await prisma.settings.update({
        where: { id: SETTINGS_ID },
        data: {
          siteTitle: input.siteTitle,
          siteSubtitle: input.siteSubtitle,
          heroGreeting: input.heroGreeting,
          heroSubtitle: input.heroSubtitle,
          heroDescription: input.heroDescription,
          primaryEmail: input.primaryEmail,
          secondaryEmail: input.secondaryEmail,
          location: input.location,
          timezone: input.timezone,
        },
      });

      return mapSettingsRecord(record);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(
          'Settings record not initialised. Seed or bootstrap the database before editing site profile settings.',
        );
      }

      throw error;
    }
  },

  async updateSiteVisibility(input: UpdateSiteVisibilityInput): Promise<DbSettings> {
    try {
      const current = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });

      if (!current) {
        throw new Error(
          'Settings record not initialised. Seed or bootstrap the database before editing visibility settings.',
        );
      }

      const currentSeoDefaults =
        parseJson<Record<string, unknown> | null>(current.seoDefaults, null) ?? {};
      const record = await prisma.settings.update({
        where: { id: SETTINGS_ID },
        data: {
          seoDefaults: JSON.stringify({
            ...currentSeoDefaults,
            visibility: input,
          }),
        },
      });

      return mapSettingsRecord(record);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(
          'Settings record not initialised. Seed or bootstrap the database before editing visibility settings.',
        );
      }

      throw error;
    }
  },
};
