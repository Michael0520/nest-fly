import { Controller, Get, Post, Body, Param, Patch, NotFoundException, BadRequestException } from '@nestjs/common';
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
    const menuItemId = parseInt(id, 10);
    
    if (isNaN(menuItemId)) {
      throw new BadRequestException('Invalid menu item ID');
    }

    const item = await this.restaurantService.getMenuItemById(menuItemId);

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return {
      message: `Details for ${item.name}`,
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
      throw new BadRequestException(
        'Order creation failed. Please check if menu items are correct.'
      );
    }

    return {
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
    const orderId = parseInt(id, 10);
    
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.restaurantService.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      message: `Order #${orderId} details`,
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
    const orderId = parseInt(id, 10);
    
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }

    const updatedOrder = await this.restaurantService.updateOrderStatus(
      orderId,
      statusData.status,
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

  // Initialize default menu (for demo purposes)
  @Post('admin/init-menu')
  @ApiOperation({ summary: 'Initialize default menu items for demo' })
  @ApiResponse({
    status: 201,
    description: 'Default menu initialized successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Menu already has items',
  })
  async initializeMenu() {
    try {
      const menuCount = await this.restaurantService.getMenuCount();

      if (menuCount > 0) {
        return {
          success: false,
          message: `Menu already has ${menuCount} items. Cannot initialize default menu.`,
          existingCount: menuCount,
        };
      }

      const result = await this.restaurantService.initializeDefaultMenu();

      return {
        success: true,
        message: `Successfully initialized ${result.count} default menu items!`,
        data: {
          count: result.count,
          items: result.items,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to initialize default menu',
      };
    }
  }
}
