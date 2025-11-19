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

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Database (optional for now, uncomment when needed)
  // DATABASE_URL: z.string().url(),

  // Auth (optional for now, uncomment when needed)
  // JWT_SECRET: z.string().min(32),
  // SESSION_COOKIE_NAME: z.string().default('app_session'),
  // SESSION_COOKIE_SECURE: z.string().transform((val) => val === 'true').default('true'),

  // Third-party (optional)
  // SENTRY_DSN: z.string().url().optional(),

  // Feature flags (optional)
  // FEATURE_X: z.string().transform((val) => val === 'true').default('false'),
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

// For debugging in development
if (env.NODE_ENV === 'development') {
  console.log('✅ Environment variables validated successfully');
}
