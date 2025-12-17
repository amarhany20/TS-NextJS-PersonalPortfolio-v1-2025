import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';
const url = new URL(baseURL);
const port = url.port || (url.protocol === 'https:' ? '443' : '80');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 120_000,
  use: {
    baseURL,
    storageState: 'playwright/.auth/admin.json',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  globalSetup: './tests/e2e/global-setup.ts',
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'npx tsx tests/e2e/webserver.ts',
    url: baseURL,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1' && !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV ?? 'test',
      PORT: process.env.PORT ?? port,
      DATABASE_URL: process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.DATABASE_URL ?? 'file:./tmp/playwright.sqlite',
      SEED_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME ?? process.env.SEED_ADMIN_USERNAME ?? 'admin',
      SEED_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
