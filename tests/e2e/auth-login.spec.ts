import { expect, test } from '@playwright/test';

const LOGGED_OUT_STORAGE_STATE = { cookies: [], origins: [] };

test.describe('Authentication', () => {
  test.use({ storageState: LOGGED_OUT_STORAGE_STATE });

  test('shows a clear error for invalid credentials', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('definitely-not-the-password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid username or password').first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects unauthenticated /admin visits to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
