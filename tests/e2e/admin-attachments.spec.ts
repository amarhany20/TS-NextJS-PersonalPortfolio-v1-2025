import { expect, request as playwrightRequest, test } from '@playwright/test';

import { getPlaywrightBaseUrl } from './base-url';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin attachments library', () => {
  test.skip(
    !process.env.BLOB_READ_WRITE_TOKEN,
    'requires BLOB_READ_WRITE_TOKEN (Vercel Blob is the only attachment storage)',
  );

  test('uploads and deletes an attachment', async ({ page }) => {
    const unique = Date.now();
    const filename = `e2e-upload-${unique}.txt`;
    const baseURL = getPlaywrightBaseUrl();

    let assetId: string | null = null;

    try {
      await page.goto('/admin/attachments', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Attachments' })).toBeVisible();

      const input = page.locator('input[type="file"]');
      await input.setInputFiles({
        name: filename,
        mimeType: 'text/plain',
        buffer: Buffer.from('E2E attachment upload'),
      });

      await expect(page.locator('article', { hasText: filename })).toBeVisible({ timeout: 20000 });

      const card = page.locator('article', { hasText: filename });
      page.once('dialog', (dialog) => dialog.accept());
      await card.getByRole('button', { name: 'Delete asset' }).click();
      await expect(page.locator('article', { hasText: filename })).toHaveCount(0);
    } finally {
      assetId = await findAssetId(filename, baseURL);
      if (assetId) {
        await cleanupAttachment(assetId, baseURL);
      }
    }
  });
});

async function findAssetId(filename: string, baseURL: string) {
  const api = await playwrightRequest.newContext({
    baseURL,
    storageState: 'playwright/.auth/admin.json',
  });

  try {
    const response = await api.get('/api/v1/attachments');
    if (!response.ok()) return null;

    const payload = (await response.json().catch(() => null)) as any;
    const assets = (payload?.data?.attachments ?? []) as Array<{
      id: string;
      originalName?: string;
      filename?: string;
    }>;
    const match = assets.find(
      (item) => item.originalName === filename || item.filename === filename,
    );
    return match?.id ?? null;
  } finally {
    await api.dispose();
  }
}

async function cleanupAttachment(id: string, baseURL: string) {
  const api = await playwrightRequest.newContext({
    baseURL,
    storageState: 'playwright/.auth/admin.json',
  });
  const response = await api.delete(`/api/v1/attachments/${id}`);
  const responseText = response.ok() || response.status() === 404 ? '' : await response.text();
  await api.dispose();

  if (response.ok() || response.status() === 404) return;

  console.warn(`Cleanup failed for attachment ${id}: ${response.status()} ${responseText}`);
}
