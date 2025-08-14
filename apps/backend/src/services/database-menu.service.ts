import { Injectable } from '@nestjs/common';
import { IMenuService } from './menu.service.interface';
import { PrismaService } from '../prisma/prisma.service';
import { MenuItem } from '../types/menu.interface';
import { Cuisine } from '@prisma/client';

@Injectable()
export class DatabaseMenuService implements IMenuService {
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

  async getAvailableMenuItems(): Promise<MenuItem[]> {
    console.log('DatabaseMenuService: Fetching menu items from database');
    
    const menuItems = await this.prisma.menuItem.findMany({
      where: { available: true }
    });

    return menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    }));
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    console.log(`DatabaseMenuService: Fetching menu item ${id} from database`);
    
    const item = await this.prisma.menuItem.findUnique({
      where: { id, available: true }
    });

    if (!item) return null;

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    };
  }

  async getMenuByCuisine(cuisine: string): Promise<MenuItem[]> {
    console.log(`DatabaseMenuService: Fetching ${cuisine} menu items from database`);
    
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        cuisine: this.mapStringToCuisine(cuisine as MenuItem['cuisine']),
        available: true
      }
    });

    return menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      cuisine: this.mapCuisineToString(item.cuisine),
    }));
  }

  async isMenuItemAvailable(id: number): Promise<boolean> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      select: { available: true }
    });
    
    return item?.available || false;
  }

  async updateMenuItemAvailability(id: number, available: boolean): Promise<void> {
    console.log(`DatabaseMenuService: Updating menu item ${id} availability to ${available}`);
    
    await this.prisma.menuItem.update({
      where: { id },
      data: { available }
    });
  }
}