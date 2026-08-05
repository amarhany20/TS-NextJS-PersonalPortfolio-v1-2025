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

    const restorePassword =
      process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now';

    const restoreResponse = await request.post('/api/v1/admin/backup', {
      multipart: {
        file: {
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: Buffer.from(JSON.stringify(backup)),
        },
        password: restorePassword,
      },
    });

    expect(restoreResponse.ok()).toBeTruthy();
    const payload = await restoreResponse.json();
    expect(payload.success).toBe(true);
  });

  test('rejects restore without a password', async ({ request }) => {
    const exportResponse = await request.get('/api/v1/admin/backup');
    expect(exportResponse.ok()).toBeTruthy();
    const backup = await exportResponse.json();

    const restoreResponse = await request.post('/api/v1/admin/backup', {
      multipart: {
        file: {
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: Buffer.from(JSON.stringify(backup)),
        },
      },
    });

    expect(restoreResponse.status()).toBe(400);
    const payload = await restoreResponse.json();
    expect(payload.success).toBe(false);
  });

  test('rejects restore with the wrong password', async ({ request }) => {
    const exportResponse = await request.get('/api/v1/admin/backup');
    expect(exportResponse.ok()).toBeTruthy();
    const backup = await exportResponse.json();

    const restoreResponse = await request.post('/api/v1/admin/backup', {
      multipart: {
        file: {
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: Buffer.from(JSON.stringify(backup)),
        },
        password: 'definitely-wrong',
      },
    });

    expect(restoreResponse.status()).toBe(403);
    const payload = await restoreResponse.json();
    expect(payload.success).toBe(false);
  });

  test('rejects malformed backup JSON with a 400', async ({ request }) => {
    const restoreResponse = await request.post('/api/v1/admin/backup', {
      multipart: {
        file: {
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: Buffer.from('{ not valid json'),
        },
        password: process.env.E2E_ADMIN_PASSWORD ?? 'change-me-now',
      },
    });

    expect(restoreResponse.status()).toBe(400);
    const payload = await restoreResponse.json();
    expect(payload.success).toBe(false);
  });
});
