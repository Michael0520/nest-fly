import { test, expect } from '@playwright/test';

test.describe('Homepage Statistics', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('should display restaurant statistics correctly', async ({ page }) => {
    // Wait for stats to load
    await page.waitForLoadState('networkidle');
    
    // Check if statistics section is visible
    const statsSection = page.locator('[data-testid="restaurant-stats"]');
    await expect(statsSection).toBeVisible();

    // Check individual stat cards
    const totalMenuItems = page.locator('[data-testid="stat-menu-items"]');
    const totalOrders = page.locator('[data-testid="stat-total-orders"]');
    const totalRevenue = page.locator('[data-testid="stat-total-revenue"]');

    await expect(totalMenuItems).toBeVisible();
    await expect(totalOrders).toBeVisible();
    await expect(totalRevenue).toBeVisible();

    // Check that stats contain numbers (not just loading text)
    await expect(totalMenuItems).not.toContainText('Loading');
    await expect(totalMenuItems).not.toContainText('Failed');
    await expect(totalOrders).not.toContainText('Loading');
    await expect(totalOrders).not.toContainText('Failed');
    await expect(totalRevenue).not.toContainText('Loading');
    await expect(totalRevenue).not.toContainText('Failed');

    // Check that stats show actual numbers
    const menuItemsText = await totalMenuItems.textContent();
    const ordersText = await totalOrders.textContent();
    const revenueText = await totalRevenue.textContent();

    expect(menuItemsText).toMatch(/\d+/); // Should contain numbers
    expect(ordersText).toMatch(/\d+/);
    expect(revenueText).toMatch(/\d+/);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/admin/stats', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/');
    
    // Check that error is handled gracefully
    const errorMessage = page.locator('[data-testid="stats-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Failed to load statistics');
  });

  test('should show loading state initially', async ({ page }) => {
    // Slow down API response to test loading state
    await page.route('/api/admin/stats', route => {
      setTimeout(() => {
        route.continue();
      }, 1000);
    });

    await page.goto('/');
    
    // Check loading state
    const loadingIndicator = page.locator('[data-testid="stats-loading"]');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');
    await expect(loadingIndicator).not.toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Check navigation links
    const menuLink = page.locator('a[href="/menu"]');
    const ordersLink = page.locator('a[href="/orders"]');
    const createOrderLink = page.locator('a[href="/create-order"]');

    await expect(menuLink).toBeVisible();
    await expect(ordersLink).toBeVisible();
    await expect(createOrderLink).toBeVisible();

    // Test navigation
    await menuLink.click();
    await expect(page).toHaveURL('/menu');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that stats are still visible on mobile
    const statsSection = page.locator('[data-testid="restaurant-stats"]');
    await expect(statsSection).toBeVisible();

    // Check that navigation is accessible (might be in hamburger menu)
    const mobileNavigation = page.locator('[data-testid="mobile-nav"], nav');
    await expect(mobileNavigation).toBeVisible();
  });
});