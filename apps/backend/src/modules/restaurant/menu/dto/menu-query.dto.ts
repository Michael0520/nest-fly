import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum CuisineType {
  JAPANESE = 'japanese',
  ITALIAN = 'italian',
  GENERAL = 'general',
}

export class MenuQueryDto {
  @ApiPropertyOptional({
    description: 'Filter menu items by cuisine type',
    enum: CuisineType,
    example: CuisineType.JAPANESE,
  })
  @IsOptional()
  @IsEnum(CuisineType, { message: 'Cuisine must be one of: japanese, italian, general' })
  cuisine?: CuisineType;
}