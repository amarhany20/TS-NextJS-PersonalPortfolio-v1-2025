/**
 * Vitest setup file.
 *
 * Sets the minimum required env vars so the typed env validator
 * (`src/server/server-validators/env.ts`) does not fail when a unit test
 * imports a module that reads `env`. Unit tests do not need a real database
 * connection; the env values here are placeholders that satisfy the
 * schema's required keys.
 */
const env = process.env as Record<string, string | undefined>;
env.NODE_ENV ??= 'test';
env.DATABASE_URL ??= 'postgresql://test:test@127.0.0.1:5432/test';
env.AUTH_SECRET ??= 'test-auth-secret-must-be-at-least-32-characters-long';
env.AUTH_SALT_ROUNDS ??= '4';
