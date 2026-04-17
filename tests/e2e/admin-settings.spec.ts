import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin settings pages', () => {
  test('loads setup settings panel', async ({ page }) => {
    await page.goto('/admin/settings/setup');
    await expect(page.getByRole('heading', { name: 'Setup Configuration' })).toBeVisible();
  });

  test('loads theme gallery and previews a theme', async ({ page }) => {
    await page.goto('/admin/settings/theme');
    await expect(page.getByRole('heading', { name: 'Appearance & Theme' })).toBeVisible();

    const previewCard = page.locator('article', { has: page.getByRole('button', { name: 'Activate' }) }).first();
    await previewCard.getByRole('button', { name: 'Preview' }).click();
    await expect(previewCard.getByText('Previewing')).toBeVisible();

    const activateButtons = page.getByRole('button', { name: 'Activate' });
    if ((await activateButtons.count()) > 0) {
      await activateButtons.first().click();
      await expect(page.getByText(/Theme applied/i)).toBeVisible();
    }
  });
});
