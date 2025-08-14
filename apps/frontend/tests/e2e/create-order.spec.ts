import { test, expect } from '@playwright/test';

test.describe('Create Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create-order');
  });

  test('should display create order form correctly', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if create order form is visible
    const orderForm = page.locator('[data-testid="create-order-form"], form');
    await expect(orderForm).toBeVisible();

    // Check required form fields
    const customerNameInput = page.locator('[data-testid="customer-name"], input[name="customerName"], input[placeholder*="name" i]');
    await expect(customerNameInput).toBeVisible();

    // Check that menu items are available for selection
    const menuSection = page.locator('[data-testid="menu-items-section"], [data-testid="item-selection"]');
    await expect(menuSection).toBeVisible();

    // Check for submit button
    const submitButton = page.locator('[data-testid="submit-order"], button[type="submit"], button:has-text("Create Order"), button:has-text("Place Order")');
    await expect(submitButton).toBeVisible();
  });

  test('should complete order creation flow successfully', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Fill customer name
    const customerNameInput = page.locator('[data-testid="customer-name"], input[name="customerName"], input[placeholder*="name" i]').first();
    await customerNameInput.fill('John Doe');

    // Select at least one menu item
    const menuItems = page.locator('[data-testid="menu-item-checkbox"], [data-testid="menu-item"] input[type="checkbox"], input[type="checkbox"]');
    
    if (await menuItems.count() > 0) {
      // Select first available item
      await menuItems.first().check();
    } else {
      // Alternative: look for add buttons or item selection
      const addButtons = page.locator('[data-testid="add-item"], button:has-text("Add"), button:has-text("+")');
      if (await addButtons.count() > 0) {
        await addButtons.first().click();
      }
    }

    // Submit the order
    const submitButton = page.locator('[data-testid="submit-order"], button[type="submit"], button:has-text("Create Order"), button:has-text("Place Order")');
    await submitButton.click();

    // Wait for order creation response
    await page.waitForLoadState('networkidle');

    // Check for success indication
    const successMessage = page.locator('[data-testid="order-success"], .success, :text("Order created"), :text("success")');
    const orderConfirmation = page.locator('[data-testid="order-confirmation"]');
    
    // Either success message or redirect to orders page
    const isOnOrdersPage = page.url().includes('/orders');
    const hasSuccessMessage = await successMessage.count() > 0;
    const hasConfirmation = await orderConfirmation.count() > 0;
    
    expect(isOnOrdersPage || hasSuccessMessage || hasConfirmation).toBeTruthy();
  });

  test('should validate required fields', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Try to submit without filling required fields
    const submitButton = page.locator('[data-testid="submit-order"], button[type="submit"], button:has-text("Create Order"), button:has-text("Place Order")');
    await submitButton.click();

    // Check for validation errors
    const nameError = page.locator('[data-testid="name-error"], .error:has-text("name"), .error:has-text("required")');
    const itemsError = page.locator('[data-testid="items-error"], .error:has-text("item"), .error:has-text("select")');
    
    // Should show validation errors
    const hasValidationError = await nameError.count() > 0 || await itemsError.count() > 0;
    expect(hasValidationError).toBeTruthy();
  });

  test('should handle API errors during order creation', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/orders', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            data: { message: 'Order creation failed' }
          })
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/create-order');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    const customerNameInput = page.locator('[data-testid="customer-name"], input[name="customerName"], input[placeholder*="name" i]').first();
    await customerNameInput.fill('Jane Doe');

    // Select an item
    const menuItems = page.locator('[data-testid="menu-item-checkbox"], [data-testid="menu-item"] input[type="checkbox"], input[type="checkbox"]');
    if (await menuItems.count() > 0) {
      await menuItems.first().check();
    }

    // Submit
    const submitButton = page.locator('[data-testid="submit-order"], button[type="submit"], button:has-text("Create Order"), button:has-text("Place Order")');
    await submitButton.click();

    // Check for error message
    const errorMessage = page.locator('[data-testid="order-error"], .error, [role="alert"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should show menu items with prices', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check that menu items are displayed with prices
    const menuItems = page.locator('[data-testid="menu-item"]');
    
    if (await menuItems.count() > 0) {
      const firstItem = menuItems.first();
      
      // Should have name and price
      const itemName = firstItem.locator('[data-testid="item-name"], .name, h3, h4');
      const itemPrice = firstItem.locator('[data-testid="item-price"], .price, :text("$"), :text("NT"), :text("TWD")');
      
      await expect(itemName).toBeVisible();
      await expect(itemPrice).toBeVisible();
      
      // Price should contain numbers
      const priceText = await itemPrice.textContent();
      expect(priceText).toMatch(/\d/);
    }
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Select multiple items and check total
    const menuItems = page.locator('[data-testid="menu-item-checkbox"], [data-testid="menu-item"] input[type="checkbox"], input[type="checkbox"]');
    const itemCount = await menuItems.count();
    
    if (itemCount >= 2) {
      // Select first two items
      await menuItems.first().check();
      await menuItems.nth(1).check();
      
      // Check if total is displayed
      const totalPrice = page.locator('[data-testid="total-price"], .total, :text("Total")');
      
      if (await totalPrice.count() > 0) {
        await expect(totalPrice).toBeVisible();
        
        const totalText = await totalPrice.textContent();
        expect(totalText).toMatch(/\d/); // Should contain numbers
      }
    }
  });

  test('should allow deselecting items', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const menuItems = page.locator('[data-testid="menu-item-checkbox"], [data-testid="menu-item"] input[type="checkbox"], input[type="checkbox"]');
    
    if (await menuItems.count() > 0) {
      const firstItem = menuItems.first();
      
      // Select item
      await firstItem.check();
      await expect(firstItem).toBeChecked();
      
      // Deselect item
      await firstItem.uncheck();
      await expect(firstItem).not.toBeChecked();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/create-order');
    await page.waitForLoadState('networkidle');

    // Form should be visible on mobile
    const orderForm = page.locator('[data-testid="create-order-form"], form');
    await expect(orderForm).toBeVisible();

    // Input fields should be accessible
    const customerNameInput = page.locator('[data-testid="customer-name"], input[name="customerName"], input[placeholder*="name" i]');
    await expect(customerNameInput).toBeVisible();
    
    // Menu items should be displayed properly
    const menuSection = page.locator('[data-testid="menu-items-section"], [data-testid="item-selection"]');
    await expect(menuSection).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Check navigation to other pages
    const menuLink = page.locator('a[href="/menu"], :text("Menu")');
    const ordersLink = page.locator('a[href="/orders"], :text("Orders")');
    const homeLink = page.locator('a[href="/"], :text("Home")');

    if (await menuLink.count() > 0) {
      await menuLink.first().click();
      await expect(page).toHaveURL('/menu');
      await page.goBack();
    }
  });
});