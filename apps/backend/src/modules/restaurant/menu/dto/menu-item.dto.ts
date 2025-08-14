import { ApiProperty } from '@nestjs/swagger';
import { CuisineType } from './menu-query.dto';

export class MenuItemDto {
  @ApiProperty({
    description: 'Menu item ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Menu item name',
    example: 'Sushi Platter',
  })
  name: string;

  @ApiProperty({
    description: 'Price in TWD (cents)',
    example: 380,
  })
  price: number;

  @ApiProperty({
    description: 'Item description',
    example: 'Fresh sashimi sushi with wasabi and ginger',
  })
  description: string;

  @ApiProperty({
    description: 'Cuisine type',
    enum: CuisineType,
    example: CuisineType.JAPANESE,
  })
  cuisine: CuisineType;
}

export class MenuResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Welcome to our international restaurant! Here is our full menu:',
  })
  message: string;

  @ApiProperty({
    description: 'Array of menu items',
    type: [MenuItemDto],
  })
  menu: MenuItemDto[];
}