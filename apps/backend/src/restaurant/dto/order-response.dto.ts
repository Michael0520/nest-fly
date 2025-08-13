import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../types/menu.interface';
import { MenuItemDto } from './menu-response.dto';

export class OrderDto implements Order {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Array of ordered items',
    type: [MenuItemDto],
  })
  items: MenuItemDto[];

  @ApiProperty({
    description: 'Total price of the order',
    example: 700,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  customerName: string;

  @ApiProperty({
    description: 'Current status of the order',
    enum: ['pending', 'preparing', 'ready', 'served'],
    example: 'pending',
  })
  status: 'pending' | 'preparing' | 'ready' | 'served';

  @ApiProperty({
    description: 'Order creation time',
    example: '2024-01-01T12:00:00Z',
  })
  orderTime: Date;
}

export class CreateOrderResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example:
      'Order created successfully! Our waitstaff has received your order and our chefs are preparing it...',
  })
  message: string;

  @ApiProperty({
    description: 'Created order details',
    type: OrderDto,
  })
  order: OrderDto;
}

export class GetOrderResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Order details',
    type: OrderDto,
  })
  order: OrderDto;
}
