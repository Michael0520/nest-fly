import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, ArrayNotEmpty, MinLength, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name for the order',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Customer name must be at least 2 characters long' })
  customerName: string;

  @ApiProperty({
    description: 'Array of menu item IDs to order',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one item must be selected' })
  @IsInt({ each: true, message: 'All item IDs must be integers' })
  @Min(1, { each: true, message: 'Item IDs must be positive numbers' })
  itemIds: number[];
}