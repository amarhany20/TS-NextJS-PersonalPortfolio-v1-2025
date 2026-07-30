import { expect, test } from '@playwright/test';

test.describe('Public site navigation', () => {
  test('navigates through main pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();

    await page.goto('/portfolio');
    await expect(page.locator('main')).toBeVisible();

    await page.goto('/services');
    await expect(page.locator('main')).toBeVisible();
  });

  test('responsive navigation works', async ({ page }) => {
    // Set to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home');

    // The mobile layout keeps the hero summary visible without relying on placeholder copy.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Portfolio/i }).first()).toBeVisible();
  });
});
