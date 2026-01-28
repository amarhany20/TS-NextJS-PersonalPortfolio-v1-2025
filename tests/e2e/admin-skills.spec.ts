import { expect, request as playwrightRequest, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin skills CRUD', () => {
  test('creates, edits, and deletes a skill group', async ({ page }) => {
    const unique = Date.now();
    const title = `E2E Skills Group ${unique}`;
    const slug = `e2e-skills-${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

    try {
      await page.goto('/admin/skills/new');
      await expect(page.getByRole('heading', { name: 'Create skill group' })).toBeVisible();


      const fillField = async (label: string, value: string) => {
        await page.getByLabel(label, { exact: true }).fill(value);
      };

      await fillField('Title', title);
      await fillField('Slug', slug);
      await fillField('Summary', 'Automation smoke coverage');
      await fillField('Skill names', 'Next.js\nTypeScript');


      await page.getByRole('button', { name: 'Create group' }).click();
      await expect(page).toHaveURL(/\/admin\/skills$/);
      await expect(page.locator('tr', { hasText: title }).first()).toBeVisible();

      await expect(page.getByText(`/${slug}`)).toBeVisible();

      const row = page.locator('tr', { hasText: `/${slug}` });
      await row.getByRole('link', { name: /Edit/i }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/skills/${slug}$`));

      await fillField('Title', `${title} Updated`);

      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page).toHaveURL(/\/admin\/skills$/);
      await expect(page.getByText(`${title} Updated`)).toBeVisible();

      const updatedRow = page.locator('tr', { hasText: `/${slug}` });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedRow.getByRole('button', { name: new RegExp(`Delete ${title} Updated`, 'i') }).click();
      await expect(page.locator('tr', { hasText: `/${slug}` })).toHaveCount(0);
    } finally {
      await cleanupSkillGroup(slug, baseURL);
    }
  });
});

async function cleanupSkillGroup(slug: string, baseURL: string) {
  if (!slug) return;

  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });
  const response = await api.delete(`/api/v1/skills/${slug}`);
  await api.dispose();

  if (response.ok() || response.status() === 404) {
    return;
  }

  console.warn(`Cleanup failed for slug ${slug}: ${response.status()} ${await response.text()}`);
}
