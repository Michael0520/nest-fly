import { Injectable } from '@nestjs/common';
import { MenuItem, Order } from '../types/menu.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Cuisine, OrderStatus } from '@prisma/client';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  // Helper methods to convert between Prisma enums and interface types
  private mapCuisineToString(cuisine: Cuisine): MenuItem['cuisine'] {
    const cuisineMap: Record<Cuisine, MenuItem['cuisine']> = {
      JAPANESE: 'japanese',
      ITALIAN: 'italian',
      GENERAL: 'general',
    };
    return cuisineMap[cuisine];
  }

  private mapStringToCuisine(cuisine: MenuItem['cuisine']): Cuisine {
    const cuisineMap: Record<MenuItem['cuisine'], Cuisine> = {
      japanese: 'JAPANESE',
      italian: 'ITALIAN',
      general: 'GENERAL',
    };
    return cuisineMap[cuisine];
  }

  private mapOrderStatusToString(status: OrderStatus): Order['status'] {
    const statusMap: Record<OrderStatus, Order['status']> = {
      PENDING: 'pending',
      PREPARING: 'preparing',
      READY: 'ready',
      SERVED: 'served',
    };
    return statusMap[status];
  }

  private mapStringToOrderStatus(status: Order['status']): OrderStatus {
    const statusMap: Record<Order['status'], OrderStatus> = {
      pending: 'PENDING',
      preparing: 'PREPARING',
      ready: 'READY',
      served: 'SERVED',
    };
    return statusMap[status];
  }

  // Get full menu
  async getFullMenu(): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany();
    return menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    }));
  }

  // Get menu by cuisine type
  async getMenuByCuisine(
    cuisine: 'japanese' | 'italian' | 'general',
  ): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        cuisine: this.mapStringToCuisine(cuisine),
      },
    });
    return menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    }));
  }

  // Get menu item by ID
  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) return undefined;

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    };
  }

  // Create order
  async createOrder(
    customerName: string,
    itemIds: number[],
  ): Promise<Order | null> {
    // Verify all menu items exist
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
      },
    });

    if (menuItems.length === 0) {
      return null;
    }

    const totalPrice = menuItems.reduce((sum, item) => sum + item.price, 0);

    // Create order with related order items
    const order = await this.prisma.order.create({
      data: {
        customerName,
        totalPrice,
        orderItems: {
          create: itemIds.map((itemId) => ({
            menuItemId: itemId,
            quantity: 1,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return {
      id: order.id,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
      status: this.mapOrderStatusToString(order.status),
      orderTime: order.orderTime,
      items: order.orderItems.map((orderItem) => ({
        id: orderItem.menuItem.id,
        name: orderItem.menuItem.name,
        price: orderItem.menuItem.price,
        description: orderItem.menuItem.description,
        cuisine: this.mapCuisineToString(orderItem.menuItem.cuisine),
      })),
    };
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        orderTime: 'desc',
      },
    });

    return orders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
      status: this.mapOrderStatusToString(order.status),
      orderTime: order.orderTime,
      items: order.orderItems.map((orderItem) => ({
        id: orderItem.menuItem.id,
        name: orderItem.menuItem.name,
        price: orderItem.menuItem.price,
        description: orderItem.menuItem.description,
        cuisine: this.mapCuisineToString(orderItem.menuItem.cuisine),
      })),
    }));
  }

  // Get order by ID
  async getOrderById(id: number): Promise<Order | undefined> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) return undefined;

    return {
      id: order.id,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
      status: this.mapOrderStatusToString(order.status),
      orderTime: order.orderTime,
      items: order.orderItems.map((orderItem) => ({
        id: orderItem.menuItem.id,
        name: orderItem.menuItem.name,
        price: orderItem.menuItem.price,
        description: orderItem.menuItem.description,
        cuisine: this.mapCuisineToString(orderItem.menuItem.cuisine),
      })),
    };
  }

  // Update order status
  async updateOrderStatus(
    orderId: number,
    status: Order['status'],
  ): Promise<Order | null> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: this.mapStringToOrderStatus(status) },
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      return {
        id: updatedOrder.id,
        customerName: updatedOrder.customerName,
        totalPrice: updatedOrder.totalPrice,
        status: this.mapOrderStatusToString(updatedOrder.status),
        orderTime: updatedOrder.orderTime,
        items: updatedOrder.orderItems.map((orderItem) => ({
          id: orderItem.menuItem.id,
          name: orderItem.menuItem.name,
          price: orderItem.menuItem.price,
          description: orderItem.menuItem.description,
          cuisine: this.mapCuisineToString(orderItem.menuItem.cuisine),
        })),
      };
    } catch {
      return null;
    }
  }

  // Get restaurant statistics
  async getRestaurantStats() {
    const [totalMenuItems, totalOrders, totalRevenue] = await Promise.all([
      this.prisma.menuItem.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      totalMenuItems,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  }

  // Initialize default menu items (for demo purposes)
  async initializeDefaultMenu(): Promise<{ count: number; items: MenuItem[] }> {
    const existingCount = await this.prisma.menuItem.count();
    
    if (existingCount > 0) {
      throw new Error('Menu already has items. Cannot initialize default menu.');
    }

    const defaultMenuItems = [
      {
        name: 'Sushi Platter',
        price: 380,
        description: 'Fresh sashimi sushi with wasabi and ginger',
        cuisine: 'JAPANESE' as Cuisine,
      },
      {
        name: 'Margherita Pizza',
        price: 320,
        description: 'Classic Italian pizza with fresh mozzarella and basil',
        cuisine: 'ITALIAN' as Cuisine,
      },
      {
        name: 'Burger Combo',
        price: 250,
        description: 'Beef burger with crispy fries and coleslaw',
        cuisine: 'GENERAL' as Cuisine,
      },
      {
        name: 'Chicken Teriyaki',
        price: 280,
        description: 'Grilled chicken with teriyaki sauce and steamed rice',
        cuisine: 'JAPANESE' as Cuisine,
      },
      {
        name: 'Pasta Carbonara',
        price: 290,
        description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
        cuisine: 'ITALIAN' as Cuisine,
      },
    ];

    const result = await this.prisma.menuItem.createMany({
      data: defaultMenuItems,
    });

    const createdItems = await this.getFullMenu();

    return {
      count: result.count,
      items: createdItems,
    };
  }

  // Get menu count
  async getMenuCount(): Promise<number> {
    return await this.prisma.menuItem.count();
  }
}
