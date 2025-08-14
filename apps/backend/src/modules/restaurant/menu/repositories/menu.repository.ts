import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { MenuItem } from '../../../../types/menu.interface';
import { Cuisine } from '@prisma/client';

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapCuisineToString(cuisine: Cuisine): MenuItem['cuisine'] {
    const cuisineMap: Record<Cuisine, MenuItem['cuisine']> = {
      JAPANESE: 'japanese',
      ITALIAN: 'italian',
      GENERAL: 'general',
    };
    return cuisineMap[cuisine];
  }

  private mapStringToCuisine(cuisine: MenuItem['cuisine']): Cuisine {
    const cuisineMap: Record<MenuItem['cuisine'], Cuisine> = {
      japanese: 'JAPANESE',
      italian: 'ITALIAN',
      general: 'GENERAL',
    };
    return cuisineMap[cuisine];
  }

  private mapToMenuItem(item: any): MenuItem {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    };
  }

  async findAll(): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      where: { available: true },
      orderBy: { id: 'asc' },
    });
    
    return menuItems.map(item => this.mapToMenuItem(item));
  }

  async findById(id: number): Promise<MenuItem | null> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id, available: true },
    });

    return item ? this.mapToMenuItem(item) : null;
  }

  async findByIds(ids: number[]): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: ids },
        available: true,
      },
    });

    return menuItems.map(item => this.mapToMenuItem(item));
  }

  async findByCuisine(cuisine: MenuItem['cuisine']): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        cuisine: this.mapStringToCuisine(cuisine),
        available: true,
      },
      orderBy: { id: 'asc' },
    });

    return menuItems.map(item => this.mapToMenuItem(item));
  }

  async count(): Promise<number> {
    return this.prisma.menuItem.count({
      where: { available: true },
    });
  }

  async createMany(items: Array<{
    name: string;
    price: number;
    description: string;
    cuisine: MenuItem['cuisine'];
  }>): Promise<number> {
    const createData = items.map(item => ({
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapStringToCuisine(item.cuisine),
    }));

    const result = await this.prisma.menuItem.createMany({
      data: createData,
    });

    return result.count;
  }

  async updateAvailability(id: number, available: boolean): Promise<MenuItem | null> {
    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: { available },
    });

    return this.mapToMenuItem(updated);
  }
}