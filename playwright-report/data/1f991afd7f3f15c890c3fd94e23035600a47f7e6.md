# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Security & Routing >> should redirect unauthenticated users away from /admin
- Location: e2e\auth.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Welcome Back/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Welcome Back/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - navigation [ref=e7]:
        - link "Home" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Stores" [ref=e9] [cursor=pointer]:
          - /url: /stores
        - link "Wishlist" [ref=e10] [cursor=pointer]:
          - /url: /wishlist
        - link "Account" [ref=e11] [cursor=pointer]:
          - /url: /profile
      - link "LuqmanGo" [ref=e13] [cursor=pointer]:
        - /url: /
        - heading "LuqmanGo" [level=1] [ref=e14]
      - generic [ref=e15]:
        - button "Open Search" [ref=e16] [cursor=pointer]:
          - img [ref=e17]
        - link "View Cart" [ref=e20] [cursor=pointer]:
          - /url: /cart
          - img [ref=e21]
  - main [ref=e24]:
    - generic [ref=e26]:
      - img [ref=e28]
      - heading "Something went wrong" [level=1] [ref=e30]
      - paragraph [ref=e31]: We encountered an unexpected issue while rendering this page. Don't worry — your data is safe. Try refreshing, or head back home.
      - group [ref=e32] [cursor=pointer]:
        - generic "Technical Details (Dev Only)" [ref=e33]
      - generic [ref=e34]:
        - button "Try Again" [ref=e35] [cursor=pointer]:
          - img [ref=e36]
          - text: Try Again
        - button "Go Home" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - text: Go Home
      - generic [ref=e45]: LuqmanGo · Premium Utility
  - generic [ref=e46]:
    - generic [ref=e47]:
      - img [ref=e49]
      - generic [ref=e51]:
        - heading "Cookie Preferences" [level=4] [ref=e52]
        - paragraph [ref=e53]: We use cookies to improve your experience and analyze traffic for LuqmanGo. No personal data is stored without your consent.
      - button "Close" [ref=e54] [cursor=pointer]:
        - img [ref=e55]
    - generic [ref=e58]:
      - button "Accept All" [ref=e59] [cursor=pointer]
      - button "Essential Only" [ref=e60] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Security & Routing', () => {
  4  | 
  5  |   test('should redirect unauthenticated users away from /admin', async ({ page }) => {
  6  |     await page.goto('/admin');
  7  |     
  8  |     // The AdminRoute component checks user status. If null, navigates to /signin or home.
  9  |     // Let's verify the URL changes to point to a login or access denied.
  10 |     await page.waitForURL('**/signin**', { timeout: 10000 });
  11 |     
  12 |     // Confirm we are on the signin page
  13 |     const signInHeader = page.getByRole('heading', { name: /Welcome Back/i });
> 14 |     await expect(signInHeader).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
  15 |   });
  16 | 
  17 |   test('should redirect unauthenticated users away from /profile', async ({ page }) => {
  18 |     await page.goto('/profile');
  19 |     
  20 |     // ProtectedRoute also blocks unauthenticated users
  21 |     await page.waitForURL('**/signin**', { timeout: 10000 });
  22 |   });
  23 | 
  24 |   test('should handle incorrect login attempts gracefully', async ({ page }) => {
  25 |     await page.goto('/signin');
  26 |     
  27 |     // Fill out form
  28 |     const emailInput = page.getByPlaceholder(/name@email.com/i);
  29 |     const passwordInput = page.getByPlaceholder(/••••••••/i);
  30 |     const loginButton = page.getByRole('button', { name: /Sign In/i });
  31 |     
  32 |     await emailInput.fill('invalid_fake_user123@example.com');
  33 |     await passwordInput.fill('wrongpassword123');
  34 |     
  35 |     // Submit
  36 |     await loginButton.click();
  37 |     
  38 |     // Expect Firebase Auth error to appear in the UI
  39 |     const errorAlert = page.locator('.error-message, [role="alert"]');
  40 |     await expect(errorAlert).toBeVisible({ timeout: 10000 });
  41 |   });
  42 | 
  43 | });
  44 | 
```