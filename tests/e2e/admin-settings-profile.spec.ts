import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin site profile', () => {
  test('saves profile changes and reflects them publicly', async ({ page }) => {
    await page.goto('/admin/settings/profile', { waitUntil: 'domcontentloaded' });

    const fullNameField = page.getByLabel('Full Name');
    await expect(fullNameField).toBeVisible();

    const original = await fullNameField.inputValue();
    const updated = `E2E Profile ${Date.now()}`;

    try {
      await fullNameField.fill(updated);
      await page.getByRole('button', { name: /save profile/i }).click();
      await expect(page.getByText(/Site profile saved/i)).toBeVisible();

      await page.reload();
      await expect(page.getByLabel('Full Name')).toHaveValue(updated);

      await page.goto('/home', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText(updated).first()).toBeVisible();
    } finally {
      await page.goto('/admin/settings/profile', { waitUntil: 'domcontentloaded' });
      await page.getByLabel('Full Name').fill(original);
      await page.getByRole('button', { name: /save profile/i }).click();
      await expect(page.getByText(/Site profile saved/i)).toBeVisible();
    }
  });
});
