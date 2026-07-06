import { expect, request as playwrightRequest, test } from '@playwright/test';

import { getPlaywrightBaseUrl } from './base-url';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin media library', () => {
  test('uploads and deletes a media asset', async ({ page }) => {
    const unique = Date.now();
    const filename = `e2e-upload-${unique}.txt`;
    const baseURL = getPlaywrightBaseUrl();

    let assetId: string | null = null;

    try {
      await page.goto('/admin/media', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Media library' })).toBeVisible();

      const input = page.locator('input[type="file"]');
      await input.setInputFiles({
        name: filename,
        mimeType: 'text/plain',
        buffer: Buffer.from('E2E media upload'),
      });

      await expect(page.locator('article', { hasText: filename })).toBeVisible({ timeout: 20000 });

      const card = page.locator('article', { hasText: filename });
      page.once('dialog', (dialog) => dialog.accept());
      await card.getByRole('button', { name: 'Delete asset' }).click();
      await expect(page.locator('article', { hasText: filename })).toHaveCount(0);
    } finally {
      assetId = await findAssetId(filename, baseURL);
      if (assetId) {
        await cleanupMediaAsset(assetId, baseURL);
      }
    }
  });
});

async function findAssetId(filename: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });

  try {
    const response = await api.get('/api/v1/media');
    if (!response.ok()) return null;

    const payload = (await response.json().catch(() => null)) as any;
    const assets = (payload?.data?.assets ?? []) as Array<{ id: string; originalName?: string; filename?: string }>;
    const match = assets.find((item) => item.originalName === filename || item.filename === filename);
    return match?.id ?? null;
  } finally {
    await api.dispose();
  }
}

async function cleanupMediaAsset(id: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });
  const response = await api.delete(`/api/v1/media/${id}`);
  const responseText = response.ok() || response.status() === 404 ? '' : await response.text();
  await api.dispose();

  if (response.ok() || response.status() === 404) return;

  console.warn(`Cleanup failed for media ${id}: ${response.status()} ${responseText}`);
}
