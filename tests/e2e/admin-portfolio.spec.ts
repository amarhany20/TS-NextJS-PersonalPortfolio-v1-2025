import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { getPlaywrightBaseUrl } from './base-url';

const DEFAULT_START_MONTH = formatYearMonth(new Date());


test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin portfolio experience', () => {
  test('loads portfolio list and creation form', async ({ page }) => {
    await page.goto('/admin/portfolio', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
    await expect(page.getByPlaceholder('Search by title, slug, or summary')).toBeVisible();
    await expect(page.getByText('No projects match that filter')).toBeVisible();

    await page.goto('/admin/portfolio/new', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Create project' })).toBeVisible();
  });


  test('creates, publishes, and deletes a project', async ({ page }) => {
    const unique = Date.now();
    const title = `E2E Project ${unique}`;
    const slug = `e2e-project-${unique}`;
    const baseURL = getPlaywrightBaseUrl();

    try {
      await page.goto('/admin/portfolio/new', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Create project' })).toBeVisible();


      const fillField = async (label: string, value: string) => {
        await page.getByLabel(new RegExp(`^${label}`)).fill(value);
      };

      await fillField('Project title', title);
      await fillField('Slug', slug);
      await fillField('Tagline', 'Automation smoke coverage');
      await fillField('Intro', 'E2E intro copy for automation coverage.');
      await fillField('Summary', 'Ensures the admin form submits end-to-end.');
      await fillField('Role', 'Automation Engineer');
      await fillField('Start', DEFAULT_START_MONTH);
      await fillField('Stack', 'Next.js\nTypeScript');


      await page.getByRole('button', { name: 'Create project' }).click();
      await expect(page).toHaveURL(/\/admin\/portfolio$/, { timeout: 15000 });

      await expect(page.locator('tr', { hasText: title }).first()).toBeVisible();


      const row = page.locator('tr', { hasText: slug });
      await expect(row.getByText('Draft')).toBeVisible();

      await row.getByRole('button', { name: new RegExp(`Publish ${title}`, 'i') }).click();
      await expect(row.getByRole('button', { name: new RegExp(`Unpublish ${title}`, 'i') })).toBeVisible();
      await expect(row.getByText('Published')).toBeVisible();

      page.once('dialog', (dialog) => dialog.accept());
      await row.getByRole('button', { name: new RegExp(`Delete ${title}`, 'i') }).click();
      await expect(page.locator('tr', { hasText: slug })).toHaveCount(0);
    } finally {
      await cleanupProject(slug, baseURL);
    }
  });

  test('reorders portfolio projects through the authenticated reorder endpoint', async ({ page, request }) => {
    const unique = Date.now();
    const firstTitle = `E2E Reorder Project A ${unique}`;
    const firstSlug = `e2e-reorder-project-a-${unique}`;
    const secondTitle = `E2E Reorder Project B ${unique}`;
    const secondSlug = `e2e-reorder-project-b-${unique}`;
    const baseURL = getPlaywrightBaseUrl();

    try {
      await createProject(request, {
        title: firstTitle,
        slug: firstSlug,
        tagline: 'First reorder project',
        intro: 'Automation reorder intro A',
        summary: 'Automation reorder summary A',
        role: 'Automation Engineer',
      });
      await createProject(request, {
        title: secondTitle,
        slug: secondSlug,
        tagline: 'Second reorder project',
        intro: 'Automation reorder intro B',
        summary: 'Automation reorder summary B',
        role: 'Automation Engineer',
      });

      await reorderProjects(request, [secondSlug, firstSlug]);

      await page.goto('/admin/portfolio', { waitUntil: 'domcontentloaded' });
      const items = page.locator('ol[aria-label="Portfolio ordering"] > li');

      await expect(items.nth(0)).toContainText(secondTitle);
      await expect(items.nth(1)).toContainText(firstTitle);
      await expect(items.nth(0)).toContainText('#1');
      await expect(items.nth(1)).toContainText('#2');
    } finally {
      await cleanupProject(firstSlug, baseURL);
      await cleanupProject(secondSlug, baseURL);
    }
  });
});

async function createProject(
  request: APIRequestContext,
  payload: {
    title: string;
    slug: string;
    tagline: string;
    intro: string;
    summary: string;
    role: string;
  },
) {
  const response = await request.post('/api/v1/portfolio', {
    data: {
      ...payload,
      visibility: 'public',
      access: 'client-owned',
      status: 'live',
      start: DEFAULT_START_MONTH,
      stack: ['Next.js', 'TypeScript'],
      published: false,
    },
  });
  const responseText = response.ok() ? '' : await response.text();

  expect(response.ok(), responseText).toBeTruthy();
}

async function reorderProjects(request: APIRequestContext, slugs: string[]) {
  const response = await request.post('/api/v1/portfolio/reorder', { data: { slugs } });
  const responseText = response.ok() ? '' : await response.text();

  expect(response.ok(), responseText).toBeTruthy();
}

async function cleanupProject(slug: string, baseURL: string) {
  if (!slug) return;

  const api = await test.request.newContext({ baseURL, storageState: 'playwright/.auth/admin.json' });
  const response = await api.delete(`/api/v1/portfolio/${slug}`);
  const responseText = response.ok() || response.status() === 404 ? '' : await response.text();
  await api.dispose();

  if (response.ok() || response.status() === 404) {
    return;
  }

  console.warn(`Cleanup failed for slug ${slug}: ${response.status()} ${responseText}`);
}

function formatYearMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
