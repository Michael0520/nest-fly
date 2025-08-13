import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New status for the order',
    enum: OrderStatus,
    example: OrderStatus.PREPARING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
