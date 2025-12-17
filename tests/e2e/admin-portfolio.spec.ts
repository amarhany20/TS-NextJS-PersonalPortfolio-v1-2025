import { expect, request as playwrightRequest, test } from '@playwright/test';

const SEEDED_PROJECT_SLUG = 'personal-portfolio-open-source';
const SEEDED_PROJECT_TITLE = 'Personal Portfolio – Open Source';
const DEFAULT_START_MONTH = formatYearMonth(new Date());

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin portfolio experience', () => {
  test('filters seeded projects and opens creation form', async ({ page }) => {
    await page.goto('/admin/portfolio');

    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();

    const searchInput = page.getByPlaceholder('Search by title, slug, or summary');
    await searchInput.click();
    await searchInput.fill(SEEDED_PROJECT_SLUG);

    await expect(page.getByText(SEEDED_PROJECT_TITLE)).toBeVisible();
    await expect(page.getByText(/Showing 1 of/i)).toBeVisible();

    await expect(page.getByText('Reorder portfolio projects')).toBeVisible();

    await page.getByRole('link', { name: 'New project' }).click();
    await expect(page).toHaveURL(/\/admin\/portfolio\/new$/);
    await expect(page.getByRole('heading', { name: 'Create project' })).toBeVisible();
  });

  test('creates, publishes, and deletes a project', async ({ page }) => {
    const unique = Date.now();
    const title = `E2E Project ${unique}`;
    const slug = `e2e-project-${unique}`;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

    try {
      await page.goto('/admin/portfolio');
      await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();

      await page.getByRole('link', { name: 'New project' }).click();
      await expect(page).toHaveURL(/\/admin\/portfolio\/new$/);

      await page.getByLabel('Project title').fill(title);
      await page.getByLabel('Slug').fill(slug);
      await page.getByLabel('Tagline').fill('Automation smoke coverage');
      await page.getByLabel('Intro').fill('E2E intro copy for automation coverage.');
      await page.getByLabel('Summary').fill('Ensures the admin form submits end-to-end.');
      await page.getByLabel('Role').fill('Automation Engineer');
      await page.getByLabel('Start').fill(DEFAULT_START_MONTH);
      await page.getByLabel('Stack').fill('Next.js\nTypeScript');

      await page.getByRole('button', { name: 'Create project' }).click();
      await expect(page).toHaveURL(/\/admin\/portfolio$/);
      await expect(page.getByText(title)).toBeVisible();

      const row = page.locator('tr', { hasText: slug });
      await expect(row.getByText('Draft')).toBeVisible();

      await row.getByRole('button', { name: new RegExp(`Publish ${title}`, 'i') }).click();
      await expect(row.getByText('Published')).toBeVisible();

      page.once('dialog', (dialog) => dialog.accept());
      await row.getByRole('button', { name: new RegExp(`Delete ${title}`, 'i') }).click();
      await expect(page.locator('tr', { hasText: slug })).toHaveCount(0);
    } finally {
      await cleanupProject(slug, baseURL);
    }
  });
});

async function cleanupProject(slug: string, baseURL: string) {
  if (!slug) return;

  const api = await playwrightRequest.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });
  const response = await api.delete(`/api/v1/portfolio/${slug}`);
  await api.dispose();

  if (response.ok() || response.status() === 404) {
    return;
  }

  console.warn(`Cleanup failed for slug ${slug}: ${response.status()} ${await response.text()}`);
}

function formatYearMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
