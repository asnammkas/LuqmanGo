import { test, expect } from '@playwright/test';

test.describe('Storefront Browsing Flow', () => {

  test('should navigate to Category page and see products', async ({ page }) => {
    await page.goto('/');
    
    // Using a broad Category that should exist based on current mock/real data
    // The homepage has circular category links. Let's find "All" or "Electronics"
    // Since we know the navbar has navigation links:
    await page.goto('/category/All');

    // Verify Category header is correct
    const categoryHeader = page.locator('h1, span', { hasText: /^All$/ });
    await expect(categoryHeader.first()).toBeVisible({ timeout: 10000 });

    // Assuming products load, test if the product grid renders elements
    const productGrid = page.locator('.product-grid');
    await expect(productGrid).toBeVisible({ timeout: 10000 });
  });

  test('should test Price Range filter inputs', async ({ page }) => {
    await page.goto('/category/All');
    
    // Open Filter Dropdown
    const filterBtn = page.getByRole('button', { name: /Filter/i });
    await filterBtn.click();
    
    // Verify Price Range section exists
    const priceRangeLabel = page.getByText(/PRICE RANGE \(LKR\)/i);
    await expect(priceRangeLabel).toBeVisible();

    // Type a Min and Max price
    const minInput = page.getByPlaceholder('Min');
    const maxInput = page.getByPlaceholder('Max');

    await minInput.fill('500');
    await maxInput.fill('5000');

    // UI should retain the values we just typed without crashing
    await expect(minInput).toHaveValue('500');
    await expect(maxInput).toHaveValue('5000');
  });

});
