import { expect, request as playwrightRequest, test } from '@playwright/test';

const DEFAULT_START_MONTH = formatYearMonth(new Date());

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin experience CRUD', () => {
  test('creates, publishes, edits, and deletes an experience entry', async ({ page }) => {
    const unique = Date.now();
    const company = `E2E Company ${unique}`;
    const title = `E2E Role ${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

    try {
      await page.goto('/admin/experience');
      await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();

      await page.getByRole('link', { name: 'New experience' }).click();
      await expect(page).toHaveURL(/\/admin\/experience\/new$/);
      await expect(page.getByRole('heading', { name: 'Create experience' })).toBeVisible();

      await page.getByLabel('Company').fill(company);
      await page.getByLabel('Title').fill(title);
      await page.getByLabel('Location').fill('Remote');
      await page.getByLabel('Start').fill(DEFAULT_START_MONTH);
      await page.getByLabel('Impact summary').fill('Automation smoke coverage');
      await page.getByLabel('Achievement bullets').fill('Built admin CRUD flows\nAdded tests');
      await page.getByLabel('Skills').fill('Next.js\nTypeScript');

      await page.getByRole('button', { name: 'Create experience' }).click();
      await expect(page).toHaveURL(/\/admin\/experience$/);
      await expect(page.getByText(company)).toBeVisible();

      const row = page.locator('tr', { hasText: company });
      await expect(row.getByText('Draft')).toBeVisible();

      await row.getByRole('button', { name: new RegExp(`Publish ${company}`, 'i') }).click();
      await expect(row.getByText('Published')).toBeVisible();

      await row.getByRole('link', { name: /Edit/i }).click();
      await expect(page).toHaveURL(/\/admin\/experience\//);
      await page.getByLabel('Impact summary').fill('Automation smoke coverage (edited)');
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page).toHaveURL(/\/admin\/experience$/);
      await expect(page.getByText('Automation smoke coverage (edited)')).toBeVisible();

      const updatedRow = page.locator('tr', { hasText: company });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedRow.getByRole('button', { name: new RegExp(`Delete ${company}`, 'i') }).click();
      await expect(page.locator('tr', { hasText: company })).toHaveCount(0);
    } finally {
      await cleanupExperience(company, title, baseURL);
    }
  });
});

async function cleanupExperience(company: string, title: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });

  try {
    const listResponse = await api.get('/api/v1/experience');
    if (!listResponse.ok()) {
      return;
    }

    const payload = (await listResponse.json().catch(() => null)) as any;
    const experience = (payload?.data?.experience ?? []) as Array<{ id: string | number; company: string; title: string }>;
    const match = experience.find((item) => item.company === company && item.title === title);
    if (!match) {
      return;
    }

    const deleteResponse = await api.delete(`/api/v1/experience/${match.id}`);
    if (deleteResponse.ok() || deleteResponse.status() === 404) {
      return;
    }

    console.warn(`Cleanup failed for experience ${match.id}: ${deleteResponse.status()} ${await deleteResponse.text()}`);
  } finally {
    await api.dispose();
  }
}

function formatYearMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
