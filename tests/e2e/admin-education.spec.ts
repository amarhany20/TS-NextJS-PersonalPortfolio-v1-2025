import { expect, request as playwrightRequest, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

const DEFAULT_START_MONTH = formatYearMonth(new Date());

test.describe('Admin education CRUD', () => {
  test('creates, edits, and deletes education record', async ({ page }) => {
    const unique = Date.now();
    const institution = `E2E University ${unique}`;
    const degree = `E2E Degree ${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    try {
      await page.goto('/admin/education/new');
      await expect(page.getByRole('heading', { name: 'Create education' })).toBeVisible();

      const fillField = async (label: string, value: string) => {
        await page.getByLabel(new RegExp(`^${label}`)).fill(value);
      };

      await fillField('Institution', institution);
      await fillField('Degree', degree);
      await fillField('Field of study', 'Computer Science');
      await fillField('Location', 'Remote');
      await fillField('Start date', DEFAULT_START_MONTH);
      await fillField('Achievements', 'Automation testing\nQuality assurance');
      await fillField('Notable project', 'Capstone project');

      await page.getByRole('button', { name: 'Create education' }).click();
      await expect(page).toHaveURL(/\/admin\/education$/);
      await expect(page.locator('tr', { hasText: institution }).first()).toBeVisible();

      const row = page.locator('tr', { hasText: institution });
      await row.getByRole('link', { name: /Edit/i }).click();
      await expect(page).toHaveURL(/\/admin\/education\//);

      await fillField('Notable project', 'Capstone project (edited)');
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page).toHaveURL(/\/admin\/education$/);
      await expect(page.locator('tr', { hasText: institution }).first()).toBeVisible();

      const updatedRow = page.locator('tr', { hasText: institution });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedRow.getByRole('button', { name: new RegExp(`Delete ${institution}`, 'i') }).click();
      await expect(page.locator('tr', { hasText: institution })).toHaveCount(0);
    } finally {
      await cleanupEducation(institution, degree, baseURL);
    }
  });
});

async function cleanupEducation(institution: string, degree: string, baseURL: string) {
  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });

  try {
    const listResponse = await api.get('/api/v1/education');
    if (!listResponse.ok()) return;

    const payload = (await listResponse.json().catch(() => null)) as any;
    const items = (payload?.data?.education ?? []) as Array<{ id: string; institution: string; degree: string }>;
    const match = items.find((item) => item.institution === institution && item.degree === degree);
    if (!match) return;

    const deleteResponse = await api.delete(`/api/v1/education/${match.id}`);
    if (deleteResponse.ok() || deleteResponse.status() === 404) return;

    console.warn(`Cleanup failed for education ${match.id}: ${deleteResponse.status()} ${await deleteResponse.text()}`);
  } finally {
    await api.dispose();
  }
}

function formatYearMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
