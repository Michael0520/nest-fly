import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from '../services/menu.service';
import { ApiDocumentation, ApiNotFoundResponse } from '../../../../common/decorators/api-response.decorator';
import { MenuQueryDto } from '../dto/menu-query.dto';

@ApiTags('Menu')
@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiDocumentation({
    operation: 'Get restaurant menu items',
    success: {
      description: 'Successfully retrieved menu items',
    },
  })
  async getMenu(@Query() query: MenuQueryDto) {
    const { cuisine } = query;
    
    if (cuisine) {
      return {
        message: `${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} cuisine menu items`,
        menu: await this.menuService.getMenuByCuisine(cuisine),
      };
    }

    return {
      message: 'Welcome to our international restaurant! Here is our full menu:',
      menu: await this.menuService.getFullMenu(),
    };
  }

  @Get(':id')
  @ApiDocumentation({
    operation: 'Get specific menu item by ID',
    success: {
      description: 'Successfully retrieved menu item',
    },
    errors: [
      { status: 404, description: 'Menu item not found' },
      { status: 400, description: 'Invalid menu item ID' },
    ],
  })
  @ApiNotFoundResponse()
  async getMenuItem(@Param('id') id: string) {
    const menuItemId = parseInt(id, 10);
    
    if (isNaN(menuItemId)) {
      throw new BadRequestException('Invalid menu item ID');
    }

    const item = await this.menuService.getMenuItemById(menuItemId);

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return {
      message: `Details for ${item.name}`,
      item,
    };
  }
}