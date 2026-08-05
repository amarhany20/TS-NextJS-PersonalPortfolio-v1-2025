import { expect, test } from '@playwright/test';

const ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'change-me-now';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Purge Database (factory reset)', () => {
  test('rejects purge without a password', async ({ request }) => {
    const response = await request.post('/api/v1/admin/purge', {
      data: { confirmText: 'PURGE' },
    });
    expect(response.status()).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
  });

  test('rejects purge with the wrong password', async ({ request }) => {
    const response = await request.post('/api/v1/admin/purge', {
      data: { password: 'definitely-wrong' },
    });
    expect(response.status()).toBe(403);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.message).toContain('Incorrect password');
  });

  test('factory reset purges content and re-bootstraps env defaults', async ({ page, request }) => {
    const unique = Date.now();
    const title = `Purge E2E Project ${unique}`;

    // Seed a portfolio project so the purge has something to wipe.
    const createResponse = await request.post('/api/v1/portfolio', {
      data: {
        title,
        slug: `purge-e2e-${unique}`,
        tagline: 'Purge coverage',
        intro: 'Purge coverage intro',
        summary: 'Purge coverage summary',
        role: 'Automation Engineer',
        visibility: 'public',
        access: 'client-owned',
        status: 'live',
        start: '2026-01',
        stack: ['Next.js'],
        published: true,
      },
    });
    expect(createResponse.ok()).toBeTruthy();

    const purgeResponse = await request.post('/api/v1/admin/purge', {
      data: { password: ADMIN_PASSWORD },
    });
    expect(purgeResponse.ok()).toBeTruthy();
    const purgePayload = await purgeResponse.json();
    expect(purgePayload.data.factoryReset).toBe(true);
    expect(purgePayload.data.totalPurged).toBeGreaterThan(0);

    // Content is gone.
    const listResponse = await request.get('/api/v1/portfolio');
    const listPayload = await listResponse.json();
    expect(listPayload.data.projects ?? []).toHaveLength(0);

    // Admin login still works after re-bootstrap.
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('Username').fill(process.env.E2E_ADMIN_USERNAME ?? 'admin');
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 15000 });
  });
});
