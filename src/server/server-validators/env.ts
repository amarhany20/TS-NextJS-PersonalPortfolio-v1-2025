/**
 * Environment Variable Validation
 *
 * Server-only module that validates and types all environment variables.
 * This is the single source of truth for process.env access.
 *
 * Usage:
 *   import { env } from '@/server/server-validators/env';
 *   console.log(env.NODE_ENV);
 */

import { z } from 'zod';

const optionalEnvString = z.string().optional();

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: optionalEnvString,

  // Database
  DATABASE_URL: optionalEnvString,
  // Direct (non-pooled) connection used by Prisma migrations on Neon-style
  // poolers. Optional at runtime; required when DATABASE_URL points at a pooler.
  DIRECT_URL: optionalEnvString,

  // Auth
  AUTH_SECRET: optionalEnvString,
  AUTH_SALT_ROUNDS: z.coerce.number().int().positive().default(12),

  // Attachments (Vercel Blob only)
  BLOB_READ_WRITE_TOKEN: optionalEnvString,

  // E2E / Playwright (test-only)
  PLAYWRIGHT_DATABASE_URL: optionalEnvString,
  PLAYWRIGHT_DIRECT_URL: optionalEnvString,
  PLAYWRIGHT_BASE_URL: optionalEnvString,
  PLAYWRIGHT_ISOLATED_BASE_URL: optionalEnvString,
  PLAYWRIGHT_ISOLATED: optionalEnvString,
  E2E_ADMIN_USERNAME: optionalEnvString,
  E2E_ADMIN_PASSWORD: optionalEnvString,

  // Admin bootstrap
  ADMIN_USERNAME: optionalEnvString,
  ADMIN_PASSWORD: optionalEnvString,
  ADMIN_EMAIL: optionalEnvString,
  ADMIN_DISPLAY_NAME: optionalEnvString,
  SEED_ADMIN_USERNAME: optionalEnvString,
  SEED_ADMIN_PASSWORD: optionalEnvString,
  SEED_ADMIN_EMAIL: optionalEnvString,
  SEED_ADMIN_DISPLAY_NAME: optionalEnvString,

  // Site bootstrap
  SITE_TITLE: optionalEnvString,
  SITE_SUBTITLE: optionalEnvString,
  SITE_DESCRIPTION: optionalEnvString,
  THEME_ID: optionalEnvString,
  PRIMARY_EMAIL: optionalEnvString,
  SECONDARY_EMAIL: optionalEnvString,
  LOCATION: optionalEnvString,
  TIMEZONE: optionalEnvString,

  // Hero
  HERO_GREETING: optionalEnvString,
  HERO_SUBTITLE: optionalEnvString,
  HERO_DESCRIPTION: optionalEnvString,
  HERO_PRIMARY_LABEL: optionalEnvString,
  HERO_PRIMARY_URL: optionalEnvString,
  HERO_SECONDARY_LABEL: optionalEnvString,
  HERO_SECONDARY_URL: optionalEnvString,

  // Contact
  CONTACT_TITLE: optionalEnvString,
  CONTACT_SUBTITLE: optionalEnvString,

  // SEO
  SEO_TITLE: optionalEnvString,
  SEO_TITLE_TEMPLATE: optionalEnvString,
  SEO_DESCRIPTION: optionalEnvString,
  SEO_KEYWORDS: optionalEnvString,
  SEO_SITE_URL: optionalEnvString,
  SEO_METADATA_BASE: optionalEnvString,
  SEO_OG_IMAGE: optionalEnvString,
  SEO_TWITTER_HANDLE: optionalEnvString,

  // Misc bootstrap metadata
  SOCIAL_LINKS_JSON: optionalEnvString,
  MAINTENANCE_MODE: optionalEnvString,
  MAINTENANCE_MESSAGE: optionalEnvString,
  npm_package_version: optionalEnvString,
});

export type Env = z.infer<typeof envSchema>;

function isBlank(value?: string) {
  return !value || value.trim().length === 0;
}

// Parse and validate environment variables
// This will throw if validation fails, preventing the app from starting with invalid config
function validateEnv(): Env {
  try {
    const parsed = envSchema.parse(process.env);

    if (isBlank(parsed.DATABASE_URL)) {
      throw new z.ZodError([
        {
          code: 'custom',
          message: 'DATABASE_URL is required.',
          path: ['DATABASE_URL'],
        },
      ]);
    }

    if (isBlank(parsed.AUTH_SECRET)) {
      throw new z.ZodError([
        {
          code: 'custom',
          message: 'AUTH_SECRET is required.',
          path: ['AUTH_SECRET'],
        },
      ]);
    }

    if ((parsed.AUTH_SECRET ?? '').length < 32) {
      throw new z.ZodError([
        {
          code: 'custom',
          message: 'AUTH_SECRET must be at least 32 characters long (iron-session requirement).',
          path: ['AUTH_SECRET'],
        },
      ]);
    }

    if (parsed.NODE_ENV === 'production') {
      if (isBlank(parsed.NEXT_PUBLIC_SITE_URL)) {
        throw new z.ZodError([
          {
            code: 'custom',
            message: 'NEXT_PUBLIC_SITE_URL is required in production.',
            path: ['NEXT_PUBLIC_SITE_URL'],
          },
        ]);
      }

      const productionSiteUrl = parsed.NEXT_PUBLIC_SITE_URL ?? '';

      try {
        const siteUrl = new URL(productionSiteUrl);
        const isLocalHost = siteUrl.hostname === 'localhost' || siteUrl.hostname === '127.0.0.1';
        if (siteUrl.protocol !== 'https:' && !isLocalHost) {
          throw new z.ZodError([
            {
              code: 'custom',
              message: 'NEXT_PUBLIC_SITE_URL must use https in production.',
              path: ['NEXT_PUBLIC_SITE_URL'],
            },
          ]);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw error;
        }

        throw new z.ZodError([
          {
            code: 'custom',
            message: 'NEXT_PUBLIC_SITE_URL must be a valid absolute URL.',
            path: ['NEXT_PUBLIC_SITE_URL'],
          },
        ]);
      }
    }

    return {
      ...parsed,
      NEXT_PUBLIC_SITE_URL: parsed.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    };
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      console.error(error.format());
    }
    throw new Error('Environment validation failed');
  }
}

// Export validated and typed env object
export const env = validateEnv();

/**
 * Re-runs the env validation against the current `process.env`. Exported for
 * tests and tooling that need to assert on the validator behavior. The
 * exported `env` is evaluated once at module load.
 */
export { validateEnv };
