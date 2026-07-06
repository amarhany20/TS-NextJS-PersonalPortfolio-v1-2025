import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin skills CRUD', () => {
  test('creates, edits, and deletes a skill group', async ({ page, request }) => {
    const unique = Date.now();
    const title = `E2E Skills Group ${unique}`;
    const slug = `e2e-skills-${unique}`;

    try {
      await createSkillGroup(request, {
        slug,
        title,
        summary: 'Automation smoke coverage',
        skills: [
          { name: 'Next.js', displayOrder: 0 },
          { name: 'TypeScript', displayOrder: 1 },
        ],
      });

      await page.goto('/admin/skills', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('tr', { hasText: title }).first()).toBeVisible();

      await expect(page.getByText(`/${slug}`)).toBeVisible();

      const row = page.locator('tr', { hasText: `/${slug}` });
      const editHref = await row.getByRole('link', { name: /Edit/i }).getAttribute('href');
      expect(editHref).toBe(`/admin/skills/${slug}`);
      await page.goto(editHref!, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: new RegExp(`Edit skill group: ${title}`) })).toBeVisible();

      await updateSkillGroup(request, slug, { title: `${title} Updated` });

      await page.goto('/admin/skills', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('tr', { hasText: `${title} Updated` }).first()).toBeVisible();

      await deleteSkillGroup(request, slug);
      await expect.poll(async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        return page.locator('tr', { hasText: `/${slug}` }).count();
      }, { timeout: 15000 }).toBe(0);
    } finally {
      await cleanupSkillGroup(slug, request);
    }
  });
});

async function createSkillGroup(request: APIRequestContext, payload: {
  slug: string;
  title: string;
  summary: string;
  skills: Array<{ name: string; displayOrder: number }>;
}) {
  const response = await request.post('/api/v1/skills', { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function updateSkillGroup(request: APIRequestContext, slug: string, payload: { title: string }) {
  const response = await request.patch(`/api/v1/skills/${slug}`, { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function deleteSkillGroup(request: APIRequestContext, slug: string) {
  const response = await request.delete(`/api/v1/skills/${slug}`);
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function cleanupSkillGroup(slug: string, request: APIRequestContext) {
  if (!slug) return;

  const response = await request.delete(`/api/v1/skills/${slug}`).catch(() => null);
  if (!response) {
    return;
  }
  const responseText = response.ok() || response.status() === 404 ? '' : await response.text();

  if (response.ok() || response.status() === 404) {
    return;
  }

  console.warn(`Cleanup failed for slug ${slug}: ${response.status()} ${responseText}`);
}
