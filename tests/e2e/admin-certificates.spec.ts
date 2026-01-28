import { expect, request as playwrightRequest, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin certificates CRUD', () => {
  test('creates, edits, and deletes a certificate', async ({ page }) => {
    const unique = Date.now();
    const name = `E2E Certificate ${unique}`;
    const issuer = `E2E Issuer ${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    try {
      await page.goto('/admin/certificates/new');
      await expect(page.getByRole('heading', { name: 'Create certificate' })).toBeVisible();

      const fillField = async (label: string, value: string) => {
        await page.getByLabel(label, { exact: true }).fill(value);
      };

      await fillField('Certificate name', name);
      await fillField('Issuer', issuer);
      await fillField('Issued date', '2025-01-01');
      await fillField('Credential ID', `CERT-${unique}`);
      await fillField('Description', 'Automation smoke coverage for certificates.');
      await fillField('Skills', 'Quality Assurance\nAutomation');
      await page.getByRole('button', { name: 'Create certificate' }).click();

      await expect(page).toHaveURL(/\/admin\/certificates$/);
      await expect(page.locator('tr', { hasText: name }).first()).toBeVisible();

      const row = page.locator('tr', { hasText: name });
      await row.getByRole('link', { name: /Edit/i }).click();
      await expect(page).toHaveURL(/\/admin\/certificates\//);

      await fillField('Description', 'Automation smoke coverage for certificates (edited).');
      await page.getByRole('button', { name: 'Save changes' }).click();

      await expect(page).toHaveURL(/\/admin\/certificates$/);
      await expect(page.locator('tr', { hasText: name }).first()).toBeVisible();

      const updatedRow = page.locator('tr', { hasText: name });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedRow.getByRole('button', { name: new RegExp(`Delete ${name}`, 'i') }).click();
      await expect(page.locator('tr', { hasText: name })).toHaveCount(0);
    } finally {
      await cleanupCertificate(name, issuer, baseURL);
    }
  });
});

async function cleanupCertificate(name: string, issuer: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });

  try {
    const listResponse = await api.get('/api/v1/certificates');
    if (!listResponse.ok()) return;

    const payload = (await listResponse.json().catch(() => null)) as any;
    const certificates = (payload?.data?.certificates ?? []) as Array<{ id: string; name: string; issuer: string }>;
    const match = certificates.find((item) => item.name === name && item.issuer === issuer);
    if (!match) return;

    const deleteResponse = await api.delete(`/api/v1/certificates/${match.id}`);
    if (deleteResponse.ok() || deleteResponse.status() === 404) return;

    console.warn(`Cleanup failed for certificate ${match.id}: ${deleteResponse.status()} ${await deleteResponse.text()}`);
  } finally {
    await api.dispose();
  }
}
