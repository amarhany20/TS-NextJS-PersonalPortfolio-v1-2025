import { expect, request as playwrightRequest, test } from '@playwright/test';

const DEFAULT_START_MONTH = formatYearMonth(new Date());

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin experience CRUD', () => {
  test('creates, publishes, edits, and deletes an experience entry', async ({ page }) => {
    const unique = Date.now();
    const company = `E2E Company ${unique}`;
    const title = `E2E Role ${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    try {
      await page.goto('/admin/experience/new');
      await expect(page.getByRole('heading', { name: 'Create experience' })).toBeVisible();


      const fillField = async (label: string, value: string) => {
        await page.getByLabel(label, { exact: true }).fill(value);
      };

      await fillField('Company', company);
      await fillField('Title', title);
      await fillField('Location', 'Remote');
      await fillField('Start', DEFAULT_START_MONTH);
      await fillField('Impact summary', 'Automation smoke coverage');
      await fillField('Achievement bullets', 'Built admin CRUD flows\nAdded tests');
      await fillField('Skills', 'Next.js\nTypeScript');


      await page.getByRole('button', { name: 'Create experience' }).click();
      await expect(page).toHaveURL(/\/admin\/experience$/);
      await expect(page.locator('tr', { hasText: company }).first()).toBeVisible();


      const row = page.locator('tr', { hasText: company });
      await expect(row.getByText('Draft')).toBeVisible();

      await row.getByRole('button', { name: new RegExp(`Publish ${company}`, 'i') }).click();
      await expect(row.getByText('Published')).toBeVisible();

      await row.getByRole('link', { name: /Edit/i }).click();
      await expect(page).toHaveURL(/\/admin\/experience\//);
      await page.getByLabel('Impact summary').fill('Automation smoke coverage (edited)');
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page).toHaveURL(/\/admin\/experience$/);
      await expect(page.locator('tr', { hasText: company }).first()).toBeVisible();


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
