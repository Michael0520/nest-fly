import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Order } from '../../../../types/menu.interface';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  private mapCuisineToString(cuisine: any): string {
    const cuisineMap: Record<string, string> = {
      JAPANESE: 'japanese',
      ITALIAN: 'italian',
      GENERAL: 'general',
    };
    return cuisineMap[cuisine] || cuisine;
  }

  private mapToOrder(order: any): Order {
    return {
      id: order.id,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
      status: this.mapOrderStatusToString(order.status),
      orderTime: order.orderTime,
      items: order.orderItems.map((orderItem: any) => ({
        id: orderItem.menuItem.id,
        name: orderItem.menuItem.name,
        price: orderItem.menuItem.price,
        description: orderItem.menuItem.description,
        cuisine: this.mapCuisineToString(orderItem.menuItem.cuisine),
      })),
    };
  }

  async create(orderData: {
    customerName: string;
    totalPrice: number;
    itemIds: number[];
  }): Promise<Order> {
    const order = await this.prisma.order.create({
      data: {
        customerName: orderData.customerName,
        totalPrice: orderData.totalPrice,
        orderItems: {
          create: orderData.itemIds.map((itemId) => ({
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

    return this.mapToOrder(order);
  }

  async findAll(): Promise<Order[]> {
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

    return orders.map(order => this.mapToOrder(order));
  }

  async findById(id: number): Promise<Order | null> {
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

    return order ? this.mapToOrder(order) : null;
  }

  async findByStatus(status: Order['status']): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: this.mapStringToOrderStatus(status),
      },
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

    return orders.map(order => this.mapToOrder(order));
  }

  async findByCustomerName(customerName: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        customerName: {
          contains: customerName,
          mode: 'insensitive',
        },
      },
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

    return orders.map(order => this.mapToOrder(order));
  }

  async updateStatus(orderId: number, status: Order['status']): Promise<Order | null> {
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

    return this.mapToOrder(updatedOrder);
  }

  async count(): Promise<number> {
    return this.prisma.order.count();
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });

    return result._sum.totalPrice || 0;
  }

  async getOrderStatsByStatus(): Promise<Record<string, number>> {
    const stats = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const result: Record<string, number> = {
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
    };

    stats.forEach(stat => {
      const statusString = this.mapOrderStatusToString(stat.status);
      result[statusString] = stat._count.status;
    });

    return result;
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.order.aggregate({
      where: {
        orderTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalPrice: true,
      },
    });

    return result._sum.totalPrice || 0;
  }
}