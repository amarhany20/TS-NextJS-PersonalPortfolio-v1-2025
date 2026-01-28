import { expect, request as playwrightRequest, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin contact inbox', () => {
  test('reviews, updates status, and deletes a submission', async ({ page }) => {
    const unique = Date.now();
    const name = `E2E Contact ${unique}`;
    const email = `e2e-${unique}@example.com`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    const submissionId = await createContactSubmission({ name, email, baseURL });

    try {
      await page.goto('/admin/contact');
      await expect(page.getByRole('heading', { name: 'Contact inbox' })).toBeVisible();

      await expect(page.getByText(name)).toBeVisible();
      await page.getByRole('button', { name: 'View message' }).first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click();

      const card = page.locator('article', { hasText: name });
      await card.getByRole('button', { name: 'Mark in progress' }).click();
      await expect(card.getByText('In progress')).toBeVisible();

      page.once('dialog', (dialog) => dialog.accept());
      await card.getByRole('button', { name: 'Delete' }).click();
      await expect(page.locator('article', { hasText: name })).toHaveCount(0);
    } finally {
      if (submissionId) {
        await cleanupContactSubmission(submissionId, baseURL);
      }
    }
  });
});

async function createContactSubmission({ name, email, baseURL }: { name: string; email: string; baseURL: string }) {
  const api = await playwrightRequest.newContext({ baseURL });

  try {
    const response = await api.post('/api/v1/contact', {
      data: {
        name,
        email,
        subject: 'E2E Contact Submission',
        message: 'Automation smoke coverage for contact inbox.',
      },
      headers: { 'Content-Type': 'application/json' },
    });

    const payload = (await response.json().catch(() => null)) as any;
    return payload?.data?.id ?? null;
  } finally {
    await api.dispose();
  }
}

async function cleanupContactSubmission(id: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });
  const response = await api.delete(`/api/v1/contact/${id}`);
  await api.dispose();

  if (response.ok() || response.status() === 404) return;

  console.warn(`Cleanup failed for contact ${id}: ${response.status()} ${await response.text()}`);
}
