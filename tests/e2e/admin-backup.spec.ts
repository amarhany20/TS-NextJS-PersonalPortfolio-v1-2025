import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin backup & restore', () => {
  test('loads the backup settings panel', async ({ page }) => {
    await page.goto('/admin/settings/backup', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'Database Backup & Restore', exact: true }),
    ).toBeVisible();
  });

  test('exports a full backup and restores it', async ({ request }) => {
    const exportResponse = await request.get('/api/v1/admin/backup');
    expect(exportResponse.ok()).toBeTruthy();

    const backup = await exportResponse.json();
    expect(backup).toHaveProperty('version');
    expect(backup).toHaveProperty('data');
    expect(Array.isArray(backup.data.portfolio)).toBe(true);

    const restoreResponse = await request.post('/api/v1/admin/backup', {
      multipart: {
        file: {
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: Buffer.from(JSON.stringify(backup)),
        },
      },
    });

    expect(restoreResponse.ok()).toBeTruthy();
    const payload = await restoreResponse.json();
    expect(payload.success).toBe(true);
  });
});
