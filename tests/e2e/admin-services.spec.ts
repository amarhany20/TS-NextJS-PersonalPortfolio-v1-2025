import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin services CRUD', () => {
  test('creates, edits, and deletes a service', async ({ page, request }) => {
    const unique = Date.now();
    const title = `E2E Service ${unique}`;
    const slug = `e2e-service-${unique}`;

    try {
      await page.goto('/admin/services/new', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Create service' })).toBeVisible();

      const fillField = async (label: string, value: string) => {
        await page.getByLabel(new RegExp(`^${label}`)).fill(value);
      };

      await fillField('Title', title);
      await fillField('Slug', slug);
      await fillField('Short description', 'Automation smoke coverage for services.');
      await fillField('Feature bullets', 'Discovery\nDelivery');
      await fillField('Technologies', 'Next.js\nTypeScript');

      await page.getByRole('button', { name: 'Create service' }).click();
      await expect(page).toHaveURL(/\/admin\/services$/, { timeout: 15000 });
      await expect(page.locator('li', { hasText: title }).first()).toBeVisible();

      const card = page.locator('li', { hasText: title });
      await card.getByRole('link', { name: 'Edit' }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/services/${slug}$`));

      await fillField('Short description', 'Automation smoke coverage for services (edited).');
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page).toHaveURL(/\/admin\/services$/);
      await expect(page.locator('li', { hasText: title }).first()).toBeVisible();

      const updatedCard = page.locator('li', { hasText: title });
      page.once('dialog', (dialog) => dialog.accept());
      await updatedCard.getByRole('button', { name: 'Delete' }).click();
      await expect(page.locator('li', { hasText: title })).toHaveCount(0);
    } finally {
      await cleanupService(request, slug);
    }
  });

  test('reorders services through the authenticated reorder endpoint', async ({
    page,
    request,
  }) => {
    const unique = Date.now();
    const firstTitle = `E2E Reorder Service A ${unique}`;
    const firstSlug = `e2e-reorder-service-a-${unique}`;
    const secondTitle = `E2E Reorder Service B ${unique}`;
    const secondSlug = `e2e-reorder-service-b-${unique}`;

    try {
      await createService(request, {
        title: firstTitle,
        slug: firstSlug,
        description: 'First service for reorder verification.',
        features: ['Discovery'],
        technologies: ['Next.js'],
      });
      await createService(request, {
        title: secondTitle,
        slug: secondSlug,
        description: 'Second service for reorder verification.',
        features: ['Delivery'],
        technologies: ['TypeScript'],
      });

      await reorderServices(request, [secondSlug, firstSlug]);

      await page.goto('/admin/services', { waitUntil: 'domcontentloaded' });
      const items = page.locator('ol[aria-label="Service ordering"] > li');

      await expect(items.nth(0)).toContainText(secondTitle);
      await expect(items.nth(1)).toContainText(firstTitle);
      await expect(items.nth(0)).toContainText('#1');
      await expect(items.nth(1)).toContainText('#2');
    } finally {
      await cleanupService(request, firstSlug);
      await cleanupService(request, secondSlug);
    }
  });
});

async function createService(
  request: APIRequestContext,
  payload: {
    title: string;
    slug: string;
    description: string;
    features: string[];
    technologies: string[];
  },
) {
  const response = await request.post('/api/v1/services', { data: payload });
  const responseText = response.ok() ? '' : await response.text();

  expect(response.ok(), responseText).toBeTruthy();
}

async function reorderServices(request: APIRequestContext, slugs: string[]) {
  const response = await request.post('/api/v1/services/reorder', { data: { slugs } });
  const responseText = response.ok() ? '' : await response.text();

  expect(response.ok(), responseText).toBeTruthy();
}

async function cleanupService(request: APIRequestContext, slug: string) {
  if (!slug) return;

  const response = await request.delete(`/api/v1/services/${slug}`);
  const responseText = response.ok() || response.status() === 404 ? '' : await response.text();

  if (response.ok() || response.status() === 404) return;

  console.warn(`Cleanup failed for service ${slug}: ${response.status()} ${responseText}`);
}
