import { expect, request as playwrightRequest, test } from '@playwright/test';

test.describe('Contact form submission', () => {
  test('submits contact form and verifies rate limiting', async () => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';

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
  });


  test('rate limiting prevents spam submissions', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';
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

