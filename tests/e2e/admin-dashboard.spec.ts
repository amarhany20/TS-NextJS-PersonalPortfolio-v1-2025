import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard Overview', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test('loads dashboard with stats', async ({ page }) => {
    await page.goto('/admin');
    
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
    await page.goto('/admin');
    
    // Check for sidebar links
    const sidebar = page.locator('aside nav');
    await expect(sidebar.getByRole('link', { name: 'Portfolio' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Theme' })).toBeVisible();
    
    // Click a link and verify navigation
    // Use the link directly to be safe
    await sidebar.locator('a[href="/admin/portfolio"]').click();
    await expect(page).toHaveURL(/\/admin\/portfolio/, { timeout: 15000 });
  });
});
