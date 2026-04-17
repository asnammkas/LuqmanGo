import { test, expect } from '@playwright/test';

test.describe('Authentication Security & Routing', () => {

  test('should redirect unauthenticated users away from /admin', async ({ page }) => {
    await page.goto('/admin');
    
    // The AdminRoute component checks user status. If null, navigates to /signin or home.
    // Let's verify the URL changes to point to a login or access denied.
    await page.waitForURL('**/signin**', { timeout: 10000 });
    
    // Confirm we are on the signin page
    const signInHeader = page.getByRole('heading', { name: /Welcome Back/i });
    await expect(signInHeader).toBeVisible();
  });

  test('should redirect unauthenticated users away from /profile', async ({ page }) => {
    await page.goto('/profile');
    
    // ProtectedRoute also blocks unauthenticated users
    await page.waitForURL('**/signin**', { timeout: 10000 });
  });

  test('should handle incorrect login attempts gracefully', async ({ page }) => {
    await page.goto('/signin');
    
    // Fill out form
    const emailInput = page.getByPlaceholder(/name@email.com/i);
    const passwordInput = page.getByPlaceholder(/••••••••/i);
    const loginButton = page.getByRole('button', { name: /Sign In/i });
    
    await emailInput.fill('invalid_fake_user123@example.com');
    await passwordInput.fill('wrongpassword123');
    
    // Submit
    await loginButton.click();
    
    // Expect Firebase Auth error to appear in the UI
    const errorAlert = page.locator('.error-message, [role="alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 10000 });
  });

});
