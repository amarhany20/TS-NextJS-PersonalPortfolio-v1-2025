import { expect, request as playwrightRequest, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin services CRUD', () => {
  test('creates, edits, and deletes a service', async ({ page }) => {
    const unique = Date.now();
    const title = `E2E Service ${unique}`;
    const slug = `e2e-service-${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    try {
      await page.goto('/admin/services/new');
      await expect(page.getByRole('heading', { name: 'Create service' })).toBeVisible();

      const fillField = async (label: string, value: string) => {
        await page.getByLabel(label, { exact: true }).fill(value);
      };

      await fillField('Title', title);
      await fillField('Slug', slug);
      await fillField('Short description', 'Automation smoke coverage for services.');
      await fillField('Feature bullets', 'Discovery\nDelivery');
      await fillField('Technologies', 'Next.js\nTypeScript');

      await page.getByRole('button', { name: 'Create service' }).click();
      await expect(page).toHaveURL(/\/admin\/services$/, { timeout: 15000 });
      await expect(page.locator('li', { hasText: title }).first()).toBeVisible();

      const card = page.locator('li', { hasText: title });
      await card.getByRole('link', { name: 'Edit' }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/services/${slug}$`));

      await fillField('Short description', 'Automation smoke coverage for services (edited).');
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page).toHaveURL(/\/admin\/services$/);
      await expect(page.locator('li', { hasText: title }).first()).toBeVisible();

      const updatedCard = page.locator('li', { hasText: title });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedCard.getByRole('button', { name: 'Delete' }).click();
      await expect(page.locator('li', { hasText: title })).toHaveCount(0);
    } finally {
      await cleanupService(slug, baseURL);
    }
  });
});

async function cleanupService(slug: string, baseURL: string) {
  if (!slug) return;

  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });
  const response = await api.delete(`/api/v1/services/${slug}`);
  await api.dispose();

  if (response.ok() || response.status() === 404) return;

  console.warn(`Cleanup failed for service ${slug}: ${response.status()} ${await response.text()}`);
}
