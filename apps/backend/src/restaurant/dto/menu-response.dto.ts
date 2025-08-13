import { ApiProperty } from '@nestjs/swagger';
import { MenuItem } from '../../types/menu.interface';

export class MenuItemDto implements MenuItem {
  @ApiProperty({
    description: 'Unique identifier for the menu item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Sushi Platter',
  })
  name: string;

  @ApiProperty({
    description: 'Price of the menu item',
    example: 380,
  })
  price: number;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'Fresh sashimi sushi',
  })
  description: string;

  @ApiProperty({
    description: 'Cuisine type',
    enum: ['japanese', 'italian', 'general'],
    example: 'japanese',
  })
  cuisine: 'japanese' | 'italian' | 'general';
}

export class MenuResponseDto {
  @ApiProperty({
    description: 'Welcome message',
    example: 'Welcome to our international restaurant! Here is our full menu:',
  })
  message: string;

  @ApiProperty({
    description: 'Array of menu items',
    type: [MenuItemDto],
  })
  menu: MenuItemDto[];
}
