import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard Overview', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test('loads dashboard with stats', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    // Check for dashboard heading
    await expect(page.getByRole('heading', { name: /Admin dashboard/i })).toBeVisible();

    // Check for stat cards
    const metricsSection = page.locator('section').filter({ hasText: 'Key metrics' });
    await expect(metricsSection.getByText('Portfolio projects', { exact: true })).toBeVisible();
    await expect(metricsSection.getByText('Experience entries', { exact: true })).toBeVisible();
    await expect(metricsSection.getByText('Skills tracked', { exact: true })).toBeVisible();

    // Check for recent activity or quick links
    await expect(page.getByText(/Quick links/i)).toBeVisible();
  });

  test('navigation sidebar works', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    // The admin shell renders one primary sidebar nav and a mobile chip nav.
    const sidebar = page.locator('aside').first();
    await expect(sidebar.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Blog', exact: true })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Theme', exact: true })).toBeVisible();

    await sidebar.getByRole('link', { name: 'Portfolio', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/portfolio/, { timeout: 15000 });
  });
});
