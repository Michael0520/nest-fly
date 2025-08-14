import { MenuItem } from '../types/menu.interface';

// Interface that defines the contract for menu services
export interface IMenuService {
  getAvailableMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | null>;
  getMenuByCuisine(cuisine: string): Promise<MenuItem[]>;
  isMenuItemAvailable(id: number): Promise<boolean>;
  updateMenuItemAvailability(id: number, available: boolean): Promise<void>;
}

// Token for dependency injection
export const MENU_SERVICE_TOKEN = Symbol('MENU_SERVICE');