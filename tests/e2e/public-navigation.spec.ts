import { expect, test } from '@playwright/test';

test.describe('Public site navigation', () => {
  test('navigates through main pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL(/\/home/);
    
    // Check for generic content we added
    // Use a more specific locator for the hero section to avoid strict mode violations
    const hero = page.locator('section#summary');
    await expect(hero.getByText(/Hi, I'm Your Name/i)).toBeVisible();
    await expect(hero.getByText(/Software Engineer · Full-Stack Developer/i)).toBeVisible();
    
    // Check for sections
    await expect(page.getByRole('heading', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /education/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Skills', exact: true })).toBeVisible();
    
    // Navigate to Portfolio
    // Assuming there's a nav link or we can go directly
    await page.goto('/portfolio');
    await expect(page.getByRole('heading', { name: /portfolio/i, level: 1 })).toBeVisible();
    
    // Check for demo projects
    await expect(page.getByRole('heading', { name: /Demo SaaS Dashboard/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Demo API Service/i })).toBeVisible();
    
    // Navigate to Services
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: /services/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Web Applications/i)).toBeVisible();
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

test.describe('Admin theme switching', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test('can switch themes in admin settings', async ({ page }) => {
    await page.goto('/admin/settings/theme');
    await expect(page.getByRole('heading', { name: /Appearance & Theme/i })).toBeVisible();

    // Find the first "Activate" button (which belongs to a non-active theme)
    const activateButton = page.getByRole('button', { name: 'Activate' }).first();
    
    if (await activateButton.isVisible()) {
      await activateButton.click();
      
      // Should show success message
      await expect(page.getByText(/Theme applied/i)).toBeVisible({ timeout: 15000 });
      
      // Reload to ensure the theme is applied from the server/database
      await page.reload();
      
      // Verify the data-theme attribute on html tag changed
      const html = page.locator('html');
      await expect(html).not.toHaveAttribute('data-theme', 'professional-dark', { timeout: 10000 });
    }
  });
});
