import {
  Controller,
  Get,
  Post,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { ApiDocumentation } from '../../../../common/decorators/api-response.decorator';

@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiDocumentation({
    operation: 'Get restaurant operation statistics',
    success: {
      description: 'Successfully retrieved statistics',
    },
  })
  async getStats() {
    const stats = await this.adminService.getRestaurantStats();
    
    return {
      message: 'Restaurant operation statistics',
      stats,
    };
  }

  @Post('menu/init')
  @ApiDocumentation({
    operation: 'Initialize default menu items for demo',
    success: {
      status: 201,
      description: 'Default menu initialized successfully',
    },
    errors: [
      { status: 409, description: 'Menu already has items' },
    ],
  })
  async initializeMenu() {
    const menuCount = await this.adminService.getMenuCount();

    if (menuCount > 0) {
      throw new ConflictException(
        `Menu already has ${menuCount} items. Cannot initialize default menu.`
      );
    }

    const result = await this.adminService.initializeDefaultMenu();

    return {
      message: `Successfully initialized ${result.count} default menu items!`,
      data: {
        count: result.count,
        items: result.items,
      },
    };
  }
}