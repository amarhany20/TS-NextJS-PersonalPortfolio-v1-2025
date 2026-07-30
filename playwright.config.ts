import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1' && !process.env.CI;
const isolatedBaseURL = process.env.PLAYWRIGHT_ISOLATED_BASE_URL ?? 'http://127.0.0.1:3100';
const baseURL = reuseExistingServer
  ? (process.env.PLAYWRIGHT_BASE_URL ?? isolatedBaseURL)
  : isolatedBaseURL;
const url = new URL(baseURL);
const port = url.port || (url.protocol === 'https:' ? '443' : '80');
const readinessUrl = new URL('/api/v1/example?name=playwright', baseURL).toString();
const playwrightDatabaseUrl = process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.DATABASE_URL;
const configuredWorkers = Number.parseInt(process.env.PLAYWRIGHT_WORKERS ?? '1', 10);
const playwrightWorkers =
  Number.isFinite(configuredWorkers) && configuredWorkers > 0 ? configuredWorkers : 1;

if (!playwrightDatabaseUrl) {
  throw new Error(
    'Playwright requires PLAYWRIGHT_DATABASE_URL or DATABASE_URL because this repo uses a PostgreSQL Prisma datasource.',
  );
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: playwrightWorkers,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 120_000,
  use: {
    baseURL,
    storageState: 'playwright/.auth/admin.json',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
  globalSetup: './tests/e2e/global-setup.ts',
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'npx tsx tests/e2e/webserver.ts',
    url: readinessUrl,
    reuseExistingServer,
    timeout: 120_000,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV ?? 'test',
      PORT: process.env.PORT ?? port,
      DATABASE_URL: playwrightDatabaseUrl,
      PLAYWRIGHT_ISOLATED: '1',
      SEED_ADMIN_USERNAME:
        process.env.E2E_ADMIN_USERNAME ?? process.env.SEED_ADMIN_USERNAME ?? 'admin',
      SEED_ADMIN_PASSWORD:
        process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
