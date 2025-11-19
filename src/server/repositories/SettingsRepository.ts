/**
 * SettingsRepository
 *
 * Provides access to the singleton settings row.
 */

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

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
  createdAt: Date;
  updatedAt: Date;
}

const SETTINGS_ID = 'settings-singleton';

export const SettingsRepository = {
  async get(): Promise<DbSettings | null> {
    const record = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });

    if (!record) {
      return null;
    }

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
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },
};
