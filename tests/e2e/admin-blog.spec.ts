import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { getPlaywrightBaseUrl } from './base-url';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin blog CRUD', () => {
  test('creates, schedules, publishes, and deletes a blog post', async ({ page, request }) => {
    const unique = Date.now();
    const title = `E2E Blog Post ${unique}`;
    const slug = `e2e-blog-post-${unique}`;
    const baseURL = getPlaywrightBaseUrl();

    // Calculate a future date for scheduling (1 day from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const scheduledDateTime = formatLocalDateTime(futureDate);

    try {
      await page.goto('/admin/blogs/new', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: /new blog post/i })).toBeVisible();


      const fillInput = async (label: string, value: string) => {
        await page.getByLabel(new RegExp(`^${label}$`, 'i')).fill(value);
      };

      const selectOption = async (label: string, value: string) => {
        await page
          .locator('label', { hasText: label })
          .locator('..')
          .locator('select')
          .first()
          .selectOption(value);
      };

      // Fill in the form
      await fillInput('Title', title);
      await fillInput('Slug', slug);
      await fillInput('Summary', 'Automation smoke coverage for blog editor');

      // Set status to scheduled
      await selectOption('Status', 'scheduled');

      // Fill in scheduled date
      await page.locator('input[type="datetime-local"]').fill(scheduledDateTime);

      
      // Fill in content (using the rich text editor)
      const contentEditor = page.locator('.ql-editor').first();
      await contentEditor.click();
      await contentEditor.fill('This is a test blog post created by E2E automation.');

      // Submit the form
      await page.getByRole('button', { name: /publish post/i }).click();
      
      // Should redirect to blog list
      await expect(page).toHaveURL(/\/admin\/blogs$/);
      await expect(page.locator('tr', { hasText: title }).first()).toBeVisible();


      // Verify the post is scheduled
      const updatedRow = page.locator('tr', { hasText: title });
      await expect(updatedRow.getByText(/scheduled/i)).toBeVisible();

      // Delete the post
      await updatedRow.getByRole('link', { name: /edit/i }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/blogs/${slug}$`));
      
      // Navigate back and delete (assuming there's a delete button or we use API)
      await page.goto('/admin/blogs', { waitUntil: 'domcontentloaded' });
      // Use API to delete since UI delete might not be implemented
      await cleanupBlogPost(slug, request);
      
      // Verify deletion
      await page.reload();
      await expect(page.locator('tr', { hasText: title })).toHaveCount(0);
    } finally {
      await cleanupBlogPost(slug, request);
    }
  });
});

async function cleanupBlogPost(slug: string, request: APIRequestContext) {
  if (!slug) return;

  const response = await request.delete(`/api/v1/blogs/${slug}`).catch(() => null);
  if (!response) {
    return;
  }
  const responseText = response.ok() || response.status() === 404 ? '' : await response.text();

  if (response.ok() || response.status() === 404) {
    return;
  }

  console.warn(`Cleanup failed for slug ${slug}: ${response.status()} ${responseText}`);
}

function formatLocalDateTime(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

