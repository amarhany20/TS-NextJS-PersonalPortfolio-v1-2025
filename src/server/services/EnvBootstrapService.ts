import { PrismaClient } from '@prisma/client';

import { hashPassword } from '@/server/security/password';
import { env } from '@/server/server-validators/env';

const SETTINGS_ID = 'settings-singleton';

const readEnvString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

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
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: readEnvString(env.SEO_TITLE) ?? readEnvString(env.SITE_TITLE) ?? 'Portfolio',
    titleTemplate: readEnvString(env.SEO_TITLE_TEMPLATE),
    description: readEnvString(env.SEO_DESCRIPTION) ?? readEnvString(env.SITE_DESCRIPTION),
    keywords: parseKeywords(env.SEO_KEYWORDS),
    siteUrl: readEnvString(env.SEO_SITE_URL) ?? siteUrl,
    metadataBase: readEnvString(env.SEO_METADATA_BASE) ?? siteUrl,
    openGraphImage: readEnvString(env.SEO_OG_IMAGE),
    twitterHandle: readEnvString(env.SEO_TWITTER_HANDLE),
  };
};

const buildHeroButtons = () => {
  const primaryLabel = readEnvString(env.HERO_PRIMARY_LABEL);
  const primaryUrl = readEnvString(env.HERO_PRIMARY_URL);
  const secondaryLabel = readEnvString(env.HERO_SECONDARY_LABEL);
  const secondaryUrl = readEnvString(env.HERO_SECONDARY_URL);

  if (!primaryLabel && !primaryUrl && !secondaryLabel && !secondaryUrl) {
    return null;
  }

  return {
    primary: primaryLabel || primaryUrl ? { text: primaryLabel, href: primaryUrl } : null,
    secondary: secondaryLabel || secondaryUrl ? { text: secondaryLabel, href: secondaryUrl } : null,
  };
};

const buildContactConfig = () => {
  const title = readEnvString(env.CONTACT_TITLE);
  const subtitle = readEnvString(env.CONTACT_SUBTITLE);

  if (!title && !subtitle) {
    return null;
  }

  return { title, subtitle };
};

export const EnvBootstrapService = {
  /**
   * Ensures the bootstrap admin user and settings row exist for the supported
   * env-driven first-run path.
   */
  async ensureSettingsAndAdmin() {
    const prisma = new PrismaClient();

    try {
      const username = (readEnvString(env.ADMIN_USERNAME) ?? 'admin').toLowerCase();
      const email = (readEnvString(env.ADMIN_EMAIL) ?? 'admin@example.com').toLowerCase();
      const displayName = readEnvString(env.ADMIN_DISPLAY_NAME) ?? 'Portfolio Admin';
      const password = env.ADMIN_PASSWORD ?? 'change-me-now';

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

      const databaseProvider = detectDatabaseProvider(env.DATABASE_URL);
      const seoDefaults = buildSeoDefaults();
      const heroButtons = buildHeroButtons();
      const contactConfig = buildContactConfig();
      const siteTitle = readEnvString(env.SITE_TITLE) ?? 'Portfolio';
      const siteSubtitle = readEnvString(env.SITE_SUBTITLE) ?? null;
      const heroGreeting = readEnvString(env.HERO_GREETING) ?? null;
      const heroSubtitle = readEnvString(env.HERO_SUBTITLE) ?? null;
      const heroDescription =
        readEnvString(env.HERO_DESCRIPTION) ?? readEnvString(env.SITE_DESCRIPTION) ?? null;
      const primaryEmail = readEnvString(env.PRIMARY_EMAIL) ?? email;
      const secondaryEmail = readEnvString(env.SECONDARY_EMAIL) ?? null;
      const location = readEnvString(env.LOCATION) ?? null;
      const timezone = readEnvString(env.TIMEZONE) ?? null;
      const theme = readEnvString(env.THEME_ID) ?? 'professional-dark';
      const maintenanceMessage = readEnvString(env.MAINTENANCE_MESSAGE) ?? null;
      const socialLinks = env.SOCIAL_LINKS_JSON ?? '[]';
      const setupVersion = env.npm_package_version ?? '1.0.0';

      await prisma.settings.upsert({
        where: { id: SETTINGS_ID },
        update: {
          siteTitle,
          siteSubtitle,
          heroGreeting,
          heroSubtitle,
          heroDescription,
          primaryEmail,
          secondaryEmail,
          location,
          timezone,
          theme,
          maintenanceMode: resolveBoolean(env.MAINTENANCE_MODE, false),
          maintenanceMessage,
          socialLinks,
          heroButtons: heroButtons ? JSON.stringify(heroButtons) : null,
          contactConfig: contactConfig ? JSON.stringify(contactConfig) : null,
          seoDefaults: JSON.stringify(seoDefaults),
          setupCompletedAt: new Date(),
          setupVersion,
          databaseProvider,
        },
        create: {
          id: SETTINGS_ID,
          siteTitle,
          siteSubtitle,
          heroGreeting,
          heroSubtitle,
          heroDescription,
          primaryEmail,
          secondaryEmail,
          location,
          timezone,
          theme,
          maintenanceMode: resolveBoolean(env.MAINTENANCE_MODE, false),
          maintenanceMessage,
          socialLinks,
          heroButtons: heroButtons ? JSON.stringify(heroButtons) : null,
          contactConfig: contactConfig ? JSON.stringify(contactConfig) : null,
          seoDefaults: JSON.stringify(seoDefaults),
          setupCompletedAt: new Date(),
          setupVersion,
          databaseProvider,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
