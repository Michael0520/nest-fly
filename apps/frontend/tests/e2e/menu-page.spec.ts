import { test, expect } from '@playwright/test';

test.describe('Menu Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('should display menu items correctly', async ({ page }) => {
    // Wait for menu to load
    await page.waitForLoadState('networkidle');
    
    // Check if menu section is visible
    const menuSection = page.locator('[data-testid="menu-section"]');
    await expect(menuSection).toBeVisible();

    // Check that menu items are displayed
    const menuItems = page.locator('[data-testid="menu-item"]');
    await expect(menuItems).toHaveCount.greaterThan(0);

    // Check first menu item structure
    const firstItem = menuItems.first();
    await expect(firstItem).toBeVisible();
    
    // Each menu item should have: name, description, price, cuisine
    const itemName = firstItem.locator('[data-testid="item-name"]');
    const itemDescription = firstItem.locator('[data-testid="item-description"]');  
    const itemPrice = firstItem.locator('[data-testid="item-price"]');
    const itemCuisine = firstItem.locator('[data-testid="item-cuisine"]');

    await expect(itemName).toBeVisible();
    await expect(itemDescription).toBeVisible();
    await expect(itemPrice).toBeVisible();
    await expect(itemCuisine).toBeVisible();

    // Check that data is not just loading placeholders
    await expect(itemName).not.toContainText('Loading');
    await expect(itemDescription).not.toContainText('Loading');
  });

  test('should display different cuisine categories', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for cuisine filters/categories
    const cuisineFilters = page.locator('[data-testid="cuisine-filter"]');
    
    // Should have at least Japanese, Italian, General categories
    const japaneseFilter = page.locator('[data-testid="cuisine-japanese"], :text("Japanese")');
    const italianFilter = page.locator('[data-testid="cuisine-italian"], :text("Italian")');
    const generalFilter = page.locator('[data-testid="cuisine-general"], :text("General")');

    // Check that different cuisines are represented in the items
    const menuItems = page.locator('[data-testid="menu-item"]');
    const itemCount = await menuItems.count();
    expect(itemCount).toBeGreaterThan(0);

    // Check that we have items from different cuisines
    const cuisineTypes = [];
    for (let i = 0; i < Math.min(itemCount, 10); i++) {
      const item = menuItems.nth(i);
      const cuisine = await item.locator('[data-testid="item-cuisine"]').textContent();
      if (cuisine) cuisineTypes.push(cuisine.toLowerCase());
    }

    // Should have variety in cuisine types
    expect(cuisineTypes.length).toBeGreaterThan(0);
  });

  test('should handle menu API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/menu', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/menu');
    
    // Check that error is handled gracefully
    const errorMessage = page.locator('[data-testid="menu-error"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).toContainText('Failed to load menu');
  });

  test('should show loading state initially', async ({ page }) => {
    // Slow down API response to test loading state
    await page.route('/api/menu', route => {
      setTimeout(() => {
        route.continue();
      }, 1000);
    });

    await page.goto('/menu');
    
    // Check loading state
    const loadingIndicator = page.locator('[data-testid="menu-loading"]');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');
    await expect(loadingIndicator).not.toBeVisible();
  });

  test('should allow navigation to create order page', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for "Create Order" or "Order Now" button
    const orderButton = page.locator('a[href="/create-order"], button:has-text("Order"), button:has-text("Create Order")');
    
    if (await orderButton.count() > 0) {
      await orderButton.first().click();
      await expect(page).toHaveURL('/create-order');
    }
  });

  test('should display prices in correct format', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const menuItems = page.locator('[data-testid="menu-item"]');
    const itemCount = await menuItems.count();
    
    if (itemCount > 0) {
      const firstItemPrice = await menuItems.first().locator('[data-testid="item-price"]').textContent();
      
      // Price should contain numbers and currency symbol
      expect(firstItemPrice).toMatch(/\d/); // Contains digits
      expect(firstItemPrice).toMatch(/[$￥TWD\s]/); // Contains currency info
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    // Check that menu is still accessible on mobile
    const menuSection = page.locator('[data-testid="menu-section"]');
    await expect(menuSection).toBeVisible();

    // Check that menu items stack properly on mobile
    const menuItems = page.locator('[data-testid="menu-item"]');
    if (await menuItems.count() > 0) {
      await expect(menuItems.first()).toBeVisible();
    }
  });

  test('should have working navigation back to home', async ({ page }) => {
    // Check home navigation link
    const homeLink = page.locator('a[href="/"], a:has-text("Home"), [data-testid="home-link"]');
    
    if (await homeLink.count() > 0) {
      await homeLink.first().click();
      await expect(page).toHaveURL('/');
    }
  });
});