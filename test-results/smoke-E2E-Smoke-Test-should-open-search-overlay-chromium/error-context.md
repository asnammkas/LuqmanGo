# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.js >> E2E Smoke Test >> should open search overlay
- Location: e2e\smoke.spec.js:18:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Open Search')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByLabel('Open Search')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('E2E Smoke Test', () => {
  4  |   test('should load the homepage and display brand name', async ({ page }) => {
  5  |     // Navigate to the homepage
  6  |     await page.goto('/');
  7  | 
  8  |     // Verify the splash screen or page content eventually shows "LuqmanGo"
  9  |     // Since there's a splash screen, we wait for the main content or the brand name in the navbar
  10 |     const brandName = page.locator('h1', { hasText: 'LuqmanGo' });
  11 |     await expect(brandName).toBeVisible({ timeout: 10000 });
  12 | 
  13 |     // Verify critical navigation elements exist
  14 |     const shopLink = page.getByLabel('View Cart');
  15 |     await expect(shopLink).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should open search overlay', async ({ page }) => {
  19 |     await page.goto('/');
  20 |     
  21 |     // The search button is in the navbar for desktop, but might be in the mobile bottom nav
  22 |     // Let's try to find it by its aria-label
  23 |     const searchButton = page.getByLabel('Open Search');
> 24 |     await expect(searchButton).toBeVisible({ timeout: 10000 });
     |                                ^ Error: expect(locator).toBeVisible() failed
  25 |     
  26 |     await searchButton.click();
  27 |     
  28 |     // Verify the search overlay is open (checking for the placeholder)
  29 |     const searchInput = page.getByPlaceholder(/Search our catalog/i);
  30 |     await expect(searchInput).toBeVisible();
  31 |   });
  32 | });
  33 | 
```