import { Page } from '@playwright/test';

export class MockAPI {
  constructor(private page: Page) {}

  /**
   * Mock successful stats API response
   */
  async mockStatsSuccess(stats = { totalMenuItems: 5, totalOrders: 10, totalRevenue: 2500 }) {
    await this.page.route('/api/admin/stats', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            message: 'Restaurant operation statistics',
            stats
          }
        })
      });
    });
  }

  /**
   * Mock stats API error
   */
  async mockStatsError(errorMessage = 'Failed to load statistics') {
    await this.page.route('/api/admin/stats', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: errorMessage })
      });
    });
  }

  /**
   * Mock successful menu API response
   */
  async mockMenuSuccess(menuItems = [
    { id: 1, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' },
    { id: 2, name: 'Margherita Pizza', price: 320, description: 'Classic Italian pizza', cuisine: 'italian' },
    { id: 3, name: 'Burger Combo', price: 250, description: 'Beef burger with fries', cuisine: 'general' }
  ]) {
    await this.page.route('/api/menu', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            message: 'Menu retrieved successfully',
            menu: menuItems
          }
        })
      });
    });
  }

  /**
   * Mock menu API error
   */
  async mockMenuError(errorMessage = 'Failed to load menu') {
    await this.page.route('/api/menu', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: errorMessage })
      });
    });
  }

  /**
   * Mock successful orders API response
   */
  async mockOrdersSuccess(orders = [
    {
      id: 1,
      customerName: 'John Doe',
      status: 'pending',
      totalPrice: 380,
      orderTime: '2025-08-14T10:00:00Z',
      items: [{ id: 1, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' }]
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      status: 'preparing',
      totalPrice: 320,
      orderTime: '2025-08-14T11:00:00Z',
      items: [{ id: 2, name: 'Margherita Pizza', price: 320, description: 'Classic Italian pizza', cuisine: 'italian' }]
    }
  ]) {
    await this.page.route('/api/orders', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            message: 'Orders retrieved successfully',
            orders
          }
        })
      });
    });
  }

  /**
   * Mock orders API error
   */
  async mockOrdersError(errorMessage = 'Failed to load orders') {
    await this.page.route('/api/orders', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: errorMessage })
      });
    });
  }

  /**
   * Mock successful order creation
   */
  async mockCreateOrderSuccess(orderId = 1, customerName = 'John Doe') {
    await this.page.route('/api/orders', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              message: 'Order created successfully',
              order: {
                id: orderId,
                customerName,
                status: 'pending',
                totalPrice: 380,
                orderTime: new Date().toISOString(),
                items: [{ id: 1, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' }]
              }
            }
          })
        });
      } else {
        route.continue();
      }
    });
  }

  /**
   * Mock order creation error
   */
  async mockCreateOrderError(errorMessage = 'Failed to create order') {
    await this.page.route('/api/orders', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            data: { message: errorMessage }
          })
        });
      } else {
        route.continue();
      }
    });
  }

  /**
   * Mock successful status update
   */
  async mockUpdateStatusSuccess(orderId: number, newStatus = 'preparing') {
    await this.page.route(`/api/orders/${orderId}/status`, route => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              message: 'Status updated successfully',
              order: {
                id: orderId,
                customerName: 'John Doe',
                status: newStatus,
                totalPrice: 380,
                orderTime: '2025-08-14T10:00:00Z',
                items: [{ id: 1, name: 'Sushi Platter', price: 380, description: 'Fresh sashimi', cuisine: 'japanese' }]
              }
            }
          })
        });
      } else {
        route.continue();
      }
    });
  }

  /**
   * Mock status update error
   */
  async mockUpdateStatusError(orderId: number, errorMessage = 'Failed to update status') {
    await this.page.route(`/api/orders/${orderId}/status`, route => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            data: { message: errorMessage }
          })
        });
      } else {
        route.continue();
      }
    });
  }

  /**
   * Add delay to API responses for loading state testing
   */
  async addDelay(apiPath: string, delayMs = 1000) {
    await this.page.route(apiPath, route => {
      setTimeout(() => {
        route.continue();
      }, delayMs);
    });
  }

  /**
   * Mock all APIs for a complete working application
   */
  async mockCompleteApp() {
    await this.mockStatsSuccess();
    await this.mockMenuSuccess();
    await this.mockOrdersSuccess();
    await this.mockCreateOrderSuccess();
  }

  /**
   * Clear all route mocks
   */
  async clearMocks() {
    await this.page.unrouteAll();
  }
}