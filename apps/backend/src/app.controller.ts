import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get welcome message and available routes' })
  @ApiResponse({ status: 200, description: 'Welcome message with API routes' })
  getWelcome() {
    return {
      message: this.appService.getHello(),
      availableRoutes: {
        menu: 'GET /restaurant/menu',
        menuItem: 'GET /restaurant/menu/:id',
        createOrder: 'POST /restaurant/order',
        allOrders: 'GET /restaurant/orders',
        specificOrder: 'GET /restaurant/order/:id',
        updateOrderStatus: 'PATCH /restaurant/order/:id/status',
        statistics: 'GET /restaurant/stats',
      },
    };
  }
}
