import { expect, request as playwrightRequest, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin recommendations CRUD', () => {
  test('creates, publishes, edits, and deletes a recommendation', async ({ page }) => {
    const unique = Date.now();
    const name = `E2E Recommender ${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    try {
      await page.goto('/admin/recommendations/new');
      await expect(page.getByRole('heading', { name: 'Create recommendation' })).toBeVisible();

      const fillField = async (label: string, value: string) => {
        await page.getByLabel(new RegExp(`^${label}`)).fill(value);
      };

      await fillField('Name', name);
      await fillField('Position/Title', 'CTO');
      await fillField('Company', 'E2E Corp');
      await fillField('Recommendation content', 'Automation smoke coverage for recommendations.');
      await fillField('Rating', '5');

      await page.getByRole('button', { name: 'Create recommendation' }).click();
      await expect(page).toHaveURL(/\/admin\/recommendations$/, { timeout: 15000 });
      await expect(page.locator('tr', { hasText: name }).first()).toBeVisible();

      const row = page.locator('tr', { hasText: name });
      await row.getByRole('button', { name: new RegExp(`Publish ${name}`, 'i') }).click();
      await expect(row.getByText('Published')).toBeVisible();

      await row.getByRole('link', { name: /Edit/i }).click();
      await expect(page).toHaveURL(/\/admin\/recommendations\//);
      await fillField('Recommendation content', 'Automation smoke coverage for recommendations (edited).');
      await page.getByRole('button', { name: 'Save changes' }).click();

      await expect(page).toHaveURL(/\/admin\/recommendations$/);
      await expect(page.locator('tr', { hasText: name }).first()).toBeVisible();

      const updatedRow = page.locator('tr', { hasText: name });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedRow.getByRole('button', { name: new RegExp(`Delete ${name}`, 'i') }).click();
      await expect(page.locator('tr', { hasText: name })).toHaveCount(0);
    } finally {
      await cleanupRecommendation(name, baseURL);
    }
  });
});

async function cleanupRecommendation(name: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });

  try {
    const listResponse = await api.get('/api/v1/recommendations').catch(() => null);
    if (!listResponse?.ok()) return;

    const payload = (await listResponse.json().catch(() => null)) as any;
    const recommendations = (payload?.data?.recommendations ?? []) as Array<{ id: string; name: string }>;
    const match = recommendations.find((item) => item.name === name);
    if (!match) return;

    const deleteResponse = await api.delete(`/api/v1/recommendations/${match.id}`).catch(() => null);
    if (!deleteResponse) return;
    if (deleteResponse.ok() || deleteResponse.status() === 404) return;

    console.warn(`Cleanup failed for recommendation ${match.id}: ${deleteResponse.status()} ${await deleteResponse.text()}`);
  } finally {
    await api.dispose();
  }
}
