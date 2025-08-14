import { Injectable } from '@nestjs/common';
import { MenuItem } from '../../../../types/menu.interface';
import { MenuRepository } from '../repositories/menu.repository';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async getFullMenu(): Promise<MenuItem[]> {
    return this.menuRepository.findAll();
  }

  async getMenuByCuisine(cuisine: 'japanese' | 'italian' | 'general'): Promise<MenuItem[]> {
    return this.menuRepository.findByCuisine(cuisine);
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    return this.menuRepository.findById(id);
  }

  async isMenuItemAvailable(id: number): Promise<boolean> {
    const item = await this.menuRepository.findById(id);
    return !!item;
  }

  async validateMenuItems(itemIds: number[]): Promise<MenuItem[]> {
    const items = await this.menuRepository.findByIds(itemIds);
    return items;
  }

  async getMenuItemsByIds(itemIds: number[]): Promise<MenuItem[]> {
    return this.menuRepository.findByIds(itemIds);
  }
}