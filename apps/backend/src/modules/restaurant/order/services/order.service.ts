import { Injectable } from '@nestjs/common';
import { Order } from '../../../../types/menu.interface';
import { OrderRepository } from '../repositories/order.repository';
import { MenuService } from '../../menu/services/menu.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly menuService: MenuService,
  ) {}

  async createOrder(customerName: string, itemIds: number[]): Promise<Order | null> {
    // Validate menu items exist
    const menuItems = await this.menuService.validateMenuItems(itemIds);
    
    if (menuItems.length === 0) {
      return null;
    }

    // Calculate total price
    const totalPrice = menuItems.reduce((sum, item) => sum + item.price, 0);

    // Create order
    const orderData = {
      customerName,
      totalPrice,
      itemIds,
    };

    return this.orderRepository.create(orderData);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async updateOrderStatus(
    orderId: number,
    status: Order['status'],
  ): Promise<Order | null> {
    const existingOrder = await this.orderRepository.findById(orderId);
    
    if (!existingOrder) {
      return null;
    }

    return this.orderRepository.updateStatus(orderId, status);
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    return this.orderRepository.findByStatus(status);
  }

  async getOrdersByCustomer(customerName: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerName(customerName);
  }
}