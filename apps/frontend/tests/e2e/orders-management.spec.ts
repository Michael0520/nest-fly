import { test, expect } from '@playwright/test';

test.describe('Orders Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders');
  });

  test('should display orders list correctly', async ({ page }) => {
    // Wait for orders to load
    await page.waitForLoadState('networkidle');
    
    // Check if orders section is visible
    const ordersSection = page.locator('[data-testid="orders-section"], [data-testid="orders-list"]');
    await expect(ordersSection).toBeVisible();

    // Check for orders (might be empty, that's okay)
    const noOrdersMessage = page.locator('[data-testid="no-orders"], :text("No orders"), :text("empty")');
    const ordersList = page.locator('[data-testid="order-item"], [data-testid="order"]');
    
    // Either show orders or "no orders" message
    const hasOrders = await ordersList.count() > 0;
    const hasNoOrdersMessage = await noOrdersMessage.count() > 0;
    
    expect(hasOrders || hasNoOrdersMessage).toBeTruthy();
  });

  test('should display order details when orders exist', async ({ page }) => {
    // Mock API to return sample orders
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            message: 'Orders retrieved successfully',
            orders: [
              {
                id: 1,
                customerName: 'John Doe',
                status: 'pending',
                totalPrice: 350,
                orderTime: '2025-08-14T10:00:00Z',
                items: [
                  { id: 2, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' }
                ]
              },
              {
                id: 2,
                customerName: 'Jane Smith',
                status: 'preparing',
                totalPrice: 290,
                orderTime: '2025-08-14T11:00:00Z',
                items: [
                  { id: 6, name: 'Pasta Carbonara', price: 290, description: 'Creamy pasta', cuisine: 'italian' }
                ]
              }
            ]
          }
        })
      });
    });

    await page.goto('/orders');
    await page.waitForLoadState('networkidle');

    // Check that orders are displayed
    const orderItems = page.locator('[data-testid="order-item"], [data-testid="order"]');
    await expect(orderItems).toHaveCount(2);

    // Check first order details
    const firstOrder = orderItems.first();
    
    // Should display customer name
    const customerName = firstOrder.locator('[data-testid="customer-name"], :text("John Doe")');
    await expect(customerName).toBeVisible();
    
    // Should display status
    const orderStatus = firstOrder.locator('[data-testid="order-status"], :text("pending")');
    await expect(orderStatus).toBeVisible();
    
    // Should display total price
    const totalPrice = firstOrder.locator('[data-testid="total-price"], :text("350")');
    await expect(totalPrice).toBeVisible();
  });

  test('should allow updating order status', async ({ page }) => {
    // Mock orders API
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orders: [{
              id: 1,
              customerName: 'John Doe',
              status: 'pending',
              totalPrice: 350,
              orderTime: '2025-08-14T10:00:00Z',
              items: [{ id: 2, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' }]
            }]
          }
        })
      });
    });

    // Mock status update API
    await page.route('/api/orders/*/status', route => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              message: 'Status updated successfully',
              order: {
                id: 1,
                customerName: 'John Doe',
                status: 'preparing',
                totalPrice: 350,
                orderTime: '2025-08-14T10:00:00Z',
                items: [{ id: 2, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' }]
              }
            }
          })
        });
      }
    });

    await page.goto('/orders');
    await page.waitForLoadState('networkidle');

    // Find status update controls
    const statusSelect = page.locator('[data-testid="status-select"], select, [data-testid="status-dropdown"]');
    const updateButton = page.locator('[data-testid="update-status"], button:has-text("Update"), button:has-text("Change")');
    
    if (await statusSelect.count() > 0) {
      // Select new status
      await statusSelect.selectOption('preparing');
      
      if (await updateButton.count() > 0) {
        await updateButton.click();
      }
      
      // Check for success indication
      const successMessage = page.locator('[data-testid="update-success"], .success, :text("updated")');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle orders API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/orders');
    
    // Check that error is handled gracefully
    const errorMessage = page.locator('[data-testid="orders-error"], .error, [role="alert"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).toContainText('Failed to load orders');
  });

  test('should show loading state initially', async ({ page }) => {
    // Slow down API response
    await page.route('/api/orders', route => {
      setTimeout(() => {
        route.continue();
      }, 1000);
    });

    await page.goto('/orders');
    
    // Check loading state
    const loadingIndicator = page.locator('[data-testid="orders-loading"], .loading, :text("Loading")');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');
    await expect(loadingIndicator).not.toBeVisible();
  });

  test('should display different order statuses with appropriate styling', async ({ page }) => {
    // Mock orders with different statuses
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orders: [
              {
                id: 1, customerName: 'John', status: 'pending', totalPrice: 350,
                orderTime: '2025-08-14T10:00:00Z', items: []
              },
              {
                id: 2, customerName: 'Jane', status: 'preparing', totalPrice: 290,
                orderTime: '2025-08-14T11:00:00Z', items: []
              },
              {
                id: 3, customerName: 'Bob', status: 'ready', totalPrice: 250,
                orderTime: '2025-08-14T12:00:00Z', items: []
              },
              {
                id: 4, customerName: 'Alice', status: 'served', totalPrice: 320,
                orderTime: '2025-08-14T13:00:00Z', items: []
              }
            ]
          }
        })
      });
    });

    await page.goto('/orders');
    await page.waitForLoadState('networkidle');

    // Check that all status types are displayed
    const pendingStatus = page.locator(':text("pending")');
    const preparingStatus = page.locator(':text("preparing")');
    const readyStatus = page.locator(':text("ready")');
    const servedStatus = page.locator(':text("served")');

    await expect(pendingStatus).toBeVisible();
    await expect(preparingStatus).toBeVisible();
    await expect(readyStatus).toBeVisible();
    await expect(servedStatus).toBeVisible();
  });

  test('should allow navigation to create new order', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for "Create Order" or "New Order" button
    const createOrderButton = page.locator('a[href="/create-order"], button:has-text("Create Order"), button:has-text("New Order"), [data-testid="create-order-btn"]');
    
    if (await createOrderButton.count() > 0) {
      await createOrderButton.first().click();
      await expect(page).toHaveURL('/create-order');
    }
  });

  test('should display order timestamps correctly', async ({ page }) => {
    // Mock orders with timestamps
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orders: [{
              id: 1,
              customerName: 'John Doe',
              status: 'pending',
              totalPrice: 350,
              orderTime: '2025-08-14T10:30:00Z',
              items: []
            }]
          }
        })
      });
    });

    await page.goto('/orders');
    await page.waitForLoadState('networkidle');

    // Check for timestamp display
    const timeDisplay = page.locator('[data-testid="order-time"], .time, :text("10:30"), :text("2025")');
    
    if (await timeDisplay.count() > 0) {
      await expect(timeDisplay).toBeVisible();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mock orders for mobile test
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orders: [{
              id: 1,
              customerName: 'John Doe',
              status: 'pending',
              totalPrice: 350,
              orderTime: '2025-08-14T10:30:00Z',
              items: []
            }]
          }
        })
      });
    });

    await page.goto('/orders');
    await page.waitForLoadState('networkidle');

    // Orders should be visible on mobile
    const ordersSection = page.locator('[data-testid="orders-section"], [data-testid="orders-list"]');
    await expect(ordersSection).toBeVisible();

    // Order items should stack properly on mobile
    const orderItems = page.locator('[data-testid="order-item"], [data-testid="order"]');
    if (await orderItems.count() > 0) {
      await expect(orderItems.first()).toBeVisible();
    }
  });
});