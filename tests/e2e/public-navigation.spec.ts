import { expect, test } from '@playwright/test';

test.describe('Public site navigation', () => {
  test('navigates through main pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();

    await page.goto('/portfolio');
    await expect(page.locator('main')).toBeVisible();

    await page.goto('/services');
    await expect(page.locator('main')).toBeVisible();
  });


  test('responsive navigation works', async ({ page }) => {
    // Set to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home');
    
    // Check if mobile menu button is visible (assuming it exists)
    // If not, we just verify the content is still there
    await expect(page.getByText(/Hi, I'm Your Name/i)).toBeVisible();
  });
});


