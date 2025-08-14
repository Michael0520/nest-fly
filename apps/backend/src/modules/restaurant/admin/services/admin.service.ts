import { Injectable } from '@nestjs/common';
import { MenuItem } from '../../../../types/menu.interface';
import { MenuRepository } from '../../menu/repositories/menu.repository';
import { OrderRepository } from '../../order/repositories/order.repository';

export interface RestaurantStats {
  totalMenuItems: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface MenuInitializationResult {
  count: number;
  items: MenuItem[];
}

@Injectable()
export class AdminService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async getRestaurantStats(): Promise<RestaurantStats> {
    const [totalMenuItems, totalOrders, totalRevenue] = await Promise.all([
      this.menuRepository.count(),
      this.orderRepository.count(),
      this.orderRepository.getTotalRevenue(),
    ]);

    return {
      totalMenuItems,
      totalOrders,
      totalRevenue,
    };
  }

  async getMenuCount(): Promise<number> {
    return this.menuRepository.count();
  }

  async initializeDefaultMenu(): Promise<MenuInitializationResult> {
    const existingCount = await this.menuRepository.count();
    
    if (existingCount > 0) {
      throw new Error('Menu already has items. Cannot initialize default menu.');
    }

    const defaultMenuItems = [
      {
        name: 'Sushi Platter',
        price: 380,
        description: 'Fresh sashimi sushi with wasabi and ginger',
        cuisine: 'japanese' as const,
      },
      {
        name: 'Margherita Pizza',
        price: 320,
        description: 'Classic Italian pizza with fresh mozzarella and basil',
        cuisine: 'italian' as const,
      },
      {
        name: 'Burger Combo',
        price: 250,
        description: 'Beef burger with crispy fries and coleslaw',
        cuisine: 'general' as const,
      },
      {
        name: 'Chicken Teriyaki',
        price: 280,
        description: 'Grilled chicken with teriyaki sauce and steamed rice',
        cuisine: 'japanese' as const,
      },
      {
        name: 'Pasta Carbonara',
        price: 290,
        description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
        cuisine: 'italian' as const,
      },
    ];

    const result = await this.menuRepository.createMany(defaultMenuItems);
    const createdItems = await this.menuRepository.findAll();

    return {
      count: result,
      items: createdItems,
    };
  }

  async getOrderStatsByStatus() {
    return this.orderRepository.getOrderStatsByStatus();
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date) {
    return this.orderRepository.getRevenueByPeriod(startDate, endDate);
  }
}