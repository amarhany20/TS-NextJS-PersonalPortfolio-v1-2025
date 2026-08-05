import { expect, test } from '@playwright/test';

test.describe('Public contact form', () => {
  test('submits a valid message and shows success', async ({ page }) => {
    const unique = Date.now();

    await page.goto('/home#contact', { waitUntil: 'domcontentloaded' });

    const form = page.locator('form');
    await expect(form).toBeVisible();

    await form.getByLabel('Name').fill(`E2E Visitor ${unique}`);
    await form.getByLabel('Email').fill(`visitor-${unique}@example.com`);
    await form.getByLabel('Subject').fill('E2E contact test');
    await form.getByLabel('Message').fill(`This is a contact form e2e message ${unique}.`);

    await form.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 15000 });
  });

  test('shows validation errors for an invalid submission', async ({ page }) => {
    await page.goto('/home#contact', { waitUntil: 'domcontentloaded' });

    const form = page.locator('form');
    await expect(form).toBeVisible();

    await form.getByLabel('Name').fill('x');
    await form.getByLabel('Email').fill('not-an-email');
    await form.getByLabel('Message').fill('short');

    await form.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/name/i).first()).toBeVisible();
    await expect(page.getByText(/valid email/i).first()).toBeVisible();
    await expect(page.getByText(/at least 10/i).first()).toBeVisible();
  });
});
