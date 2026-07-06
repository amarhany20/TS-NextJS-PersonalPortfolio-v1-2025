import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

const DEFAULT_START_MONTH = formatYearMonth(new Date());

test.describe('Admin education CRUD', () => {
  test('creates, edits, and deletes education record', async ({ page, request }) => {
    const unique = Date.now();
    const institution = `E2E University ${unique}`;
    const degree = `E2E Degree ${unique}`;

    try {
      await page.goto('/admin/education/new', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Create education' })).toBeVisible();

      const education = await createEducation(request, {
        institution,
        degree,
        field: 'Computer Science',
        location: 'Remote',
        start: DEFAULT_START_MONTH,
        achievements: ['Automation testing', 'Quality assurance'],
        project: 'Capstone project',
      });

      await page.goto('/admin/education', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('tr', { hasText: institution }).first()).toBeVisible();

      const row = page.locator('tr', { hasText: institution });
      const editHref = await row.getByRole('link', { name: /Edit/i }).getAttribute('href');
      expect(editHref).toBe(`/admin/education/${education.id}`);
      await page.goto(editHref!, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: new RegExp(`Edit ${institution}`) })).toBeVisible();

      await updateEducation(request, education.id, {
        project: 'Capstone project (edited)',
      });

      await page.goto('/admin/education', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('tr', { hasText: institution }).first()).toBeVisible();

      await deleteEducation(request, education.id);
      await expect.poll(async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        return page.locator('tr', { hasText: institution }).count();
      }, { timeout: 15000 }).toBe(0);
    } finally {
      await cleanupEducation(institution, degree, request);
    }
  });
});

async function createEducation(request: APIRequestContext, payload: {
  institution: string;
  degree: string;
  field: string;
  location: string;
  start: string;
  achievements: string[];
  project: string;
}) {
  const response = await request.post('/api/v1/education', { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();

  const body = await response.json();
  return body.data.education as { id: string };
}

async function updateEducation(request: APIRequestContext, id: string, payload: { project: string }) {
  const response = await request.patch(`/api/v1/education/${id}`, { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function deleteEducation(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/v1/education/${id}`);
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function cleanupEducation(institution: string, degree: string, request: APIRequestContext) {
  const listResponse = await request.get('/api/v1/education').catch(() => null);
  if (!listResponse?.ok()) return;

  const payload = (await listResponse.json().catch(() => null)) as any;
  const items = (payload?.data?.education ?? []) as Array<{ id: string; institution: string; degree: string }>;
  const match = items.find((item) => item.institution === institution && item.degree === degree);
  if (!match) return;

  const deleteResponse = await request.delete(`/api/v1/education/${match.id}`).catch(() => null);
  if (!deleteResponse) return;
  const responseText = deleteResponse.ok() || deleteResponse.status() === 404 ? '' : await deleteResponse.text();
  if (deleteResponse.ok() || deleteResponse.status() === 404) return;

  console.warn(`Cleanup failed for education ${match.id}: ${deleteResponse.status()} ${responseText}`);
}

function formatYearMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
