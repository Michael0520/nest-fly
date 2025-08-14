import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { ApiDocumentation } from '../../../../common/decorators/api-response.decorator';

@ApiTags('Orders')
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiDocumentation({
    operation: 'Create a new order',
    success: {
      status: 201,
      description: 'Order created successfully',
    },
    errors: [
      { status: 400, description: 'Invalid order data or menu items not found' },
    ],
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.createOrder(
      createOrderDto.customerName,
      createOrderDto.itemIds,
    );

    if (!order) {
      throw new BadRequestException(
        'Order creation failed. Please check if menu items are correct.'
      );
    }

    return {
      message: 'Order created successfully! Our chefs are preparing your meal...',
      order,
    };
  }

  @Get()
  @ApiDocumentation({
    operation: 'Get all orders',
    success: {
      description: 'Successfully retrieved all orders',
    },
  })
  async getAllOrders() {
    const orders = await this.orderService.getAllOrders();
    
    return {
      message: 'Restaurant orders list',
      orders,
      total: orders.length,
    };
  }

  @Get(':id')
  @ApiDocumentation({
    operation: 'Get specific order by ID',
    success: {
      description: 'Successfully retrieved order',
    },
    errors: [
      { status: 404, description: 'Order not found' },
      { status: 400, description: 'Invalid order ID' },
    ],
  })
  async getOrder(@Param('id') id: string) {
    const orderId = parseInt(id, 10);
    
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderService.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      message: `Order #${orderId} details`,
      order,
    };
  }

  @Patch(':id/status')
  @ApiDocumentation({
    operation: 'Update order status',
    success: {
      description: 'Order status updated successfully',
    },
    errors: [
      { status: 404, description: 'Order not found' },
      { status: 400, description: 'Invalid order ID or status' },
    ],
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    const orderId = parseInt(id, 10);
    
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }

    const updatedOrder = await this.orderService.updateOrderStatus(
      orderId,
      updateStatusDto.status,
    );

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    const statusMessages = {
      pending: 'Order is pending',
      preparing: 'Our chefs are preparing your meal...',
      ready: 'Your meal is ready for pickup!',
      served: 'Order completed. Thank you for dining with us!',
    };

    return {
      message: statusMessages[updateStatusDto.status],
      order: updatedOrder,
    };
  }
}