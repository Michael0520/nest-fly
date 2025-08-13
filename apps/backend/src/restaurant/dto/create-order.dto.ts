import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name for the order',
    example: 'John Doe',
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Array of menu item IDs to order',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  itemIds: number[];
}
