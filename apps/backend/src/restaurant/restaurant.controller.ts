import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { MenuResponseDto } from './dto/menu-response.dto';
import {
  CreateOrderResponseDto,
  GetOrderResponseDto,
} from './dto/order-response.dto';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Get full menu
  @Get('menu')
  @ApiOperation({ summary: 'Get full restaurant menu' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved menu',
    type: MenuResponseDto,
  })
  async getMenu() {
    return {
      message:
        'Welcome to our international restaurant! Here is our full menu:',
      menu: await this.restaurantService.getFullMenu(),
    };
  }

  // Get menu item details
  @Get('menu/:id')
  @ApiOperation({ summary: 'Get specific menu item by ID' })
  @ApiParam({ name: 'id', description: 'Menu item ID', type: Number })
  @ApiResponse({ status: 200, description: 'Successfully retrieved menu item' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async getMenuItem(@Param('id') id: string) {
    const item = await this.restaurantService.getMenuItemById(parseInt(id));

    if (!item) {
      return {
        success: false,
        message: 'Menu item not found',
      };
    }

    return {
      success: true,
      item,
    };
  }

  // Create new order
  @Post('order')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: CreateOrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  async createOrder(@Body() orderData: CreateOrderDto) {
    const order = await this.restaurantService.createOrder(
      orderData.customerName,
      orderData.itemIds,
    );

    if (!order) {
      return {
        success: false,
        message:
          'Order creation failed, please check if menu items are correct',
      };
    }

    return {
      success: true,
      message:
        'Order created successfully! Our waitstaff has received your order and our chefs are preparing it...',
      order,
    };
  }

  // Get all orders
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all orders',
  })
  async getAllOrders() {
    return {
      message: 'Restaurant all orders list:',
      orders: await this.restaurantService.getAllOrders(),
    };
  }

  // Get specific order
  @Get('order/:id')
  @ApiOperation({ summary: 'Get specific order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved order',
    type: GetOrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id') id: string) {
    const order = await this.restaurantService.getOrderById(parseInt(id));

    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    return {
      success: true,
      order,
    };
  }

  // Update order status
  @Patch('order/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() statusData: UpdateOrderStatusDto,
  ) {
    const updatedOrder = await this.restaurantService.updateOrderStatus(
      parseInt(id),
      statusData.status,
    );

    if (!updatedOrder) {
      return {
        success: false,
        message: 'Order status update failed',
      };
    }

    const statusMessages = {
      pending: 'Order pending',
      preparing: 'Our chefs are preparing your meal...',
      ready: 'Your meal is ready, our waitstaff will serve it soon!',
      served: 'Meal served, enjoy your dining!',
    };

    return {
      success: true,
      message: statusMessages[statusData.status],
      order: updatedOrder,
    };
  }

  // Get restaurant statistics
  @Get('stats')
  @ApiOperation({ summary: 'Get restaurant operation statistics' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved statistics',
  })
  async getStats() {
    return {
      message: 'Restaurant operation statistics',
      stats: await this.restaurantService.getRestaurantStats(),
    };
  }
}
