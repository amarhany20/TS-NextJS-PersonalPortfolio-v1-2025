import { PrismaClient } from '@prisma/client';

import { hashPassword } from '@/server/security/password';

const SETTINGS_ID = 'settings-singleton';

const detectDatabaseProvider = (url?: string) => {
  if (!url) return 'unknown';
  if (url.startsWith('file:')) return 'sqlite';
  if (url.startsWith('postgres')) return 'postgresql';
  if (url.startsWith('mysql')) return 'mysql';
  return 'unknown';
};

const parseKeywords = (value?: string) => {
  if (!value) return [];
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
};

const resolveBoolean = (value?: string, fallback = false) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

const buildSeoDefaults = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: process.env.SEO_TITLE || process.env.SITE_TITLE || 'Portfolio',
    titleTemplate: process.env.SEO_TITLE_TEMPLATE || undefined,
    description: process.env.SEO_DESCRIPTION || process.env.SITE_DESCRIPTION || undefined,
    keywords: parseKeywords(process.env.SEO_KEYWORDS),
    siteUrl: process.env.SEO_SITE_URL || siteUrl || undefined,
    metadataBase: process.env.SEO_METADATA_BASE || siteUrl || undefined,
    openGraphImage: process.env.SEO_OG_IMAGE || undefined,
    twitterHandle: process.env.SEO_TWITTER_HANDLE || undefined,
  };
};

const buildHeroButtons = () => {
  const primaryLabel = process.env.HERO_PRIMARY_LABEL;
  const primaryUrl = process.env.HERO_PRIMARY_URL;
  const secondaryLabel = process.env.HERO_SECONDARY_LABEL;
  const secondaryUrl = process.env.HERO_SECONDARY_URL;

  if (!primaryLabel && !primaryUrl && !secondaryLabel && !secondaryUrl) {
    return null;
  }

  return {
    primary: primaryLabel || primaryUrl ? { label: primaryLabel, url: primaryUrl } : null,
    secondary: secondaryLabel || secondaryUrl ? { label: secondaryLabel, url: secondaryUrl } : null,
  };
};

const buildContactConfig = () => {
  const title = process.env.CONTACT_TITLE;
  const subtitle = process.env.CONTACT_SUBTITLE;

  if (!title && !subtitle) {
    return null;
  }

  return { title, subtitle };
};

export const EnvBootstrapService = {
  async ensureSettingsAndAdmin() {
    const prisma = new PrismaClient();

    try {
      const username = (process.env.ADMIN_USERNAME ?? 'admin').trim().toLowerCase();
      const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com').trim().toLowerCase();
      const displayName = process.env.ADMIN_DISPLAY_NAME ?? 'Portfolio Admin';
      const password = process.env.ADMIN_PASSWORD ?? 'change-me-now';

      const passwordHash = await hashPassword(password);

      await prisma.user.upsert({
        where: { username },
        update: {
          email,
          displayName,
          passwordHash,
          role: 'admin',
          status: 'active',
        },
        create: {
          username,
          email,
          displayName,
          passwordHash,
          role: 'admin',
          status: 'active',
        },
      });

      const databaseProvider = detectDatabaseProvider(process.env.DATABASE_URL);
      const seoDefaults = buildSeoDefaults();
      const heroButtons = buildHeroButtons();
      const contactConfig = buildContactConfig();

      await prisma.settings.upsert({
        where: { id: SETTINGS_ID },
        update: {
          siteTitle: process.env.SITE_TITLE || 'Portfolio',
          siteSubtitle: process.env.SITE_SUBTITLE || null,
          heroGreeting: process.env.HERO_GREETING || null,
          heroSubtitle: process.env.HERO_SUBTITLE || null,
          heroDescription: process.env.HERO_DESCRIPTION || process.env.SITE_DESCRIPTION || null,
          primaryEmail: process.env.PRIMARY_EMAIL || email,
          secondaryEmail: process.env.SECONDARY_EMAIL || null,
          location: process.env.LOCATION || null,
          timezone: process.env.TIMEZONE || null,
          theme: process.env.THEME_ID || 'professional-dark',
          maintenanceMode: resolveBoolean(process.env.MAINTENANCE_MODE, false),
          maintenanceMessage: process.env.MAINTENANCE_MESSAGE || null,
          socialLinks: process.env.SOCIAL_LINKS_JSON || '[]',
          heroButtons: heroButtons ? JSON.stringify(heroButtons) : null,
          contactConfig: contactConfig ? JSON.stringify(contactConfig) : null,
          seoDefaults: JSON.stringify(seoDefaults),
          setupCompletedAt: new Date(),
          setupVersion: process.env.npm_package_version || '1.0.0',
          databaseProvider,
        },
        create: {
          id: SETTINGS_ID,
          siteTitle: process.env.SITE_TITLE || 'Portfolio',
          siteSubtitle: process.env.SITE_SUBTITLE || null,
          heroGreeting: process.env.HERO_GREETING || null,
          heroSubtitle: process.env.HERO_SUBTITLE || null,
          heroDescription: process.env.HERO_DESCRIPTION || process.env.SITE_DESCRIPTION || null,
          primaryEmail: process.env.PRIMARY_EMAIL || email,
          secondaryEmail: process.env.SECONDARY_EMAIL || null,
          location: process.env.LOCATION || null,
          timezone: process.env.TIMEZONE || null,
          theme: process.env.THEME_ID || 'professional-dark',
          maintenanceMode: resolveBoolean(process.env.MAINTENANCE_MODE, false),
          maintenanceMessage: process.env.MAINTENANCE_MESSAGE || null,
          socialLinks: process.env.SOCIAL_LINKS_JSON || '[]',
          heroButtons: heroButtons ? JSON.stringify(heroButtons) : null,
          contactConfig: contactConfig ? JSON.stringify(contactConfig) : null,
          seoDefaults: JSON.stringify(seoDefaults),
          setupCompletedAt: new Date(),
          setupVersion: process.env.npm_package_version || '1.0.0',
          databaseProvider,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
