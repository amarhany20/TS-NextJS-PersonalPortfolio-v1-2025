import { expect, test } from '@playwright/test';

const LOGGED_OUT_STORAGE_STATE = { cookies: [], origins: [] };
const ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'change-me-now';
const ADMIN_USERNAME = process.env.E2E_ADMIN_USERNAME ?? 'admin';

test.describe('Auth redirect hardening', () => {
  test.describe('authenticated admin shell', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' });

    test('bare /admin redirects to /admin/dashboard', async ({ page }) => {
      await page.goto('/admin', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 15000 });
    });
  });

  test.describe('post-login redirect', () => {
    test.use({ storageState: LOGGED_OUT_STORAGE_STATE });

    test('?next= returns to the requested admin page', async ({ page }) => {
      await page.goto('/login?next=/admin/services', { waitUntil: 'domcontentloaded' });
      await page.getByLabel('Username').fill(ADMIN_USERNAME);
      await page.getByLabel('Password').fill(ADMIN_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/admin\/services$/, { timeout: 15000 });
    });

    test('hostile ?next=/home falls back to the dashboard', async ({ page }) => {
      await page.goto('/login?next=%2Fhome', { waitUntil: 'domcontentloaded' });
      await page.getByLabel('Username').fill(ADMIN_USERNAME);
      await page.getByLabel('Password').fill(ADMIN_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 15000 });
    });

    test('hostile ?next=https://evil.com falls back to the dashboard', async ({ page }) => {
      await page.goto('/login?next=https%3A%2F%2Fevil.com', { waitUntil: 'domcontentloaded' });
      await page.getByLabel('Username').fill(ADMIN_USERNAME);
      await page.getByLabel('Password').fill(ADMIN_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 15000 });
    });
  });
});
