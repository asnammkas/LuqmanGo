import { test, expect } from '@playwright/test';

test.describe('E2E Smoke Test', () => {
  test('should load the homepage and display brand name', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Verify the splash screen or page content eventually shows "LuqmanGo"
    // Since there's a splash screen, we wait for the main content or the brand name in the navbar
    const brandName = page.locator('h1', { hasText: 'LuqmanGo' });
    await expect(brandName).toBeVisible({ timeout: 10000 });

    // Verify critical navigation elements exist
    const shopLink = page.getByLabel('View Cart');
    await expect(shopLink).toBeVisible();
  });

  test('should open search overlay', async ({ page }) => {
    await page.goto('/');
    
    // The search button is in the navbar for desktop, but might be in the mobile bottom nav
    // Let's try to find it by its aria-label
    const searchButton = page.getByLabel('Open Search');
    await expect(searchButton).toBeVisible({ timeout: 10000 });
    
    await searchButton.click();
    
    // Verify the search overlay is open (checking for the placeholder)
    const searchInput = page.getByPlaceholder(/Search for products/i);
    await expect(searchInput).toBeVisible();
  });
});
