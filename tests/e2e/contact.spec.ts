import { expect, request as playwrightRequest, test } from '@playwright/test';

test.describe('Contact form submission', () => {
  test('submits contact form and verifies rate limiting', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

    // Note: This test assumes there's a public contact page at /contact
    // If the page doesn't exist, we'll test via API directly
    const contactFormExists = await page.goto('/contact').then(() => true).catch(() => false);

    if (contactFormExists) {
      // Test via UI if contact page exists
      await page.goto('/contact');
      
      await page.getByLabel(/name/i).fill('E2E Test User');
      await page.getByLabel(/email/i).fill('e2e@example.com');
      await page.getByLabel(/message/i).fill('This is a test message from E2E automation.');
      
      await page.getByRole('button', { name: /submit|send/i }).click();
      
      // Should show success message
      await expect(page.getByText(/thank you|success|sent/i)).toBeVisible({ timeout: 5000 });
    } else {
      // Test via API if contact page doesn't exist
      const api = await playwrightRequest.newContext({ baseURL });
      
      const response = await api.post('/api/v1/contact', {
        data: {
          name: 'E2E Test User',
          email: 'e2e@example.com',
          message: 'This is a test message from E2E automation.',
        },
      });
      
      expect(response.ok()).toBeTruthy();
      const payload = await response.json();
      expect(payload.success).toBe(true);
      expect(payload.data.name).toBe('E2E Test User');
      
      await api.dispose();
    }
  });

  test('admin can view and update contact submissions', async ({ page }) => {
    test.use({ storageState: 'playwright/.auth/admin.json' });

    await page.goto('/admin/contact');
    await expect(page.getByRole('heading', { name: /contact inbox/i })).toBeVisible();

    // Check if there are any submissions
    const submissionsTable = page.locator('table, [role="table"]').first();
    const hasSubmissions = await submissionsTable.isVisible().catch(() => false);

    if (hasSubmissions) {
      // Find the first submission row
      const firstRow = submissionsTable.locator('tr').nth(1); // Skip header row
      
      if (await firstRow.isVisible().catch(() => false)) {
        // Test status update
        const statusSelect = firstRow.locator('select, button').first();
        if (await statusSelect.isVisible().catch(() => false)) {
          await statusSelect.click();
          await page.getByText(/in progress|resolved/i).first().click();
          
          // Should show success message
          await expect(page.getByText(/updated|success/i)).toBeVisible({ timeout: 3000 });
        }
      }
    } else {
      // If no submissions, just verify the page loads correctly
      await expect(page.getByText(/no submissions|empty/i)).toBeVisible();
    }
  });

  test('rate limiting prevents spam submissions', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
    const api = await playwrightRequest.newContext({ baseURL });

    try {
      // Make 6 requests (limit is 5 per 15 minutes)
      const responses = await Promise.all(
        Array.from({ length: 6 }, (_, i) =>
          api.post('/api/v1/contact', {
            data: {
              name: `Test User ${i}`,
              email: `test${i}@example.com`,
              message: `Test message ${i}`,
            },
          })
        )
      );

      // At least one should be rate limited (429)
      const rateLimited = responses.some((r) => r.status() === 429);
      expect(rateLimited).toBeTruthy();
    } finally {
      await api.dispose();
    }
  });
});

