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
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: optionalEnvString,

  // Auth
  AUTH_SECRET: optionalEnvString,
  AUTH_SALT_ROUNDS: z.coerce.number().int().positive().default(12),

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

// Parse and validate environment variables
// This will throw if validation fails, preventing the app from starting with invalid config
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
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

