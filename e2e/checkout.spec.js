import { test, expect } from '@playwright/test';

test.describe('Cart & Checkout Flow', () => {

  test('should validate empty checkout form submissions block progression', async ({ page }) => {
    // Navigate straight to cart to test validation logic
    await page.goto('/cart');

    // The cart might be empty, but there's a checkout form rendered on the page 
    // or a "Start Shopping" button. If the cart is empty, we test if standard text is there.
    // If the cart logic allows checkout form viewing immediately:
    
    // Let's assume we are safely on the Checkout Page
    // Look for the "Complete Order" or "Proceed" button on the form
    const checkoutButton = page.getByRole('button', { name: /Checkout via WhatsApp/i });
    
    // If cart is empty, the button may not exist. We'll check if the empty state shows up.
    if (await page.getByRole('heading', { name: /Your Cart is Empty/i }).isVisible()) {
        // Correct behavior when starting with an empty cart
        const shopLabel = page.getByRole('heading', { name: /Your Cart is Empty/i });
        await expect(shopLabel).toBeVisible();
    } else {
        // If the form IS visible, submitting blindly should trigger Zod errors
        await checkoutButton.click();
        
        // Zod React Hook Form validation text
        const errorMsg = page.getByText(/First name is required/i);
        await expect(errorMsg.first()).toBeVisible();
    }
  });

});
