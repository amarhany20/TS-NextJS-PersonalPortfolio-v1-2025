import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin visibility settings', () => {
  test('hides and restores the public blogs page', async ({ page, request }) => {
    await page.goto('/admin/settings/visibility', { waitUntil: 'domcontentloaded' });

    const blogsToggle = page.getByRole('checkbox', { name: /Blogs page/ });
    await expect(blogsToggle).toBeVisible();

    const originallyEnabled = await blogsToggle.isChecked();

    try {
      await blogsToggle.setChecked(false, { force: true });
      await page.getByRole('button', { name: /save visibility/i }).click();
      await expect(page.getByText(/Visibility settings saved/i)).toBeVisible();

      await expectBlogsStatus(request, 404);
    } finally {
      await page.goto('/admin/settings/visibility', { waitUntil: 'domcontentloaded' });
      const toggle = page.getByRole('checkbox', { name: /Blogs page/ });
      await toggle.setChecked(originallyEnabled, { force: true });
      await page.getByRole('button', { name: /save visibility/i }).click();
      await expect(page.getByText(/Visibility settings saved/i)).toBeVisible();

      await expectBlogsStatus(request, 200);
    }
  });
});

async function expectBlogsStatus(request: APIRequestContext, expectedStatus: number) {
  await expect(async () => {
    const response = await request.get('/blogs');
    expect(response.status()).toBe(expectedStatus);
  }).toPass({ timeout: 20000 });
}
