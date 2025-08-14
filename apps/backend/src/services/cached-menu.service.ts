import { Injectable, Inject } from '@nestjs/common';
import type { IMenuService } from './menu.service.interface';
import { MENU_SERVICE_TOKEN } from './menu.service.interface';
import { MenuItem } from '../types/menu.interface';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CachedMenuService implements IMenuService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(
    @Inject(MENU_SERVICE_TOKEN) private readonly baseMenuService: IMenuService
  ) {}

  private getCacheKey(method: string, ...args: any[]): string {
    return `${method}:${JSON.stringify(args)}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private setCache<T>(key: string, data: T, ttl = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  async getAvailableMenuItems(): Promise<MenuItem[]> {
    const cacheKey = this.getCacheKey('getAvailableMenuItems');
    const cached = this.getCache<MenuItem[]>(cacheKey);
    
    if (cached) {
      console.log('CachedMenuService: Returning cached menu items');
      return cached;
    }

    console.log('CachedMenuService: Cache miss, fetching from base service');
    const result = await this.baseMenuService.getAvailableMenuItems();
    this.setCache(cacheKey, result);
    return result;
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    const cacheKey = this.getCacheKey('getMenuItemById', id);
    const cached = this.getCache<MenuItem | null>(cacheKey);
    
    if (cached !== null) {
      console.log(`CachedMenuService: Returning cached menu item ${id}`);
      return cached;
    }

    console.log(`CachedMenuService: Cache miss for item ${id}, fetching from base service`);
    const result = await this.baseMenuService.getMenuItemById(id);
    this.setCache(cacheKey, result);
    return result;
  }

  async getMenuByCuisine(cuisine: string): Promise<MenuItem[]> {
    const cacheKey = this.getCacheKey('getMenuByCuisine', cuisine);
    const cached = this.getCache<MenuItem[]>(cacheKey);
    
    if (cached) {
      console.log(`CachedMenuService: Returning cached ${cuisine} menu items`);
      return cached;
    }

    console.log(`CachedMenuService: Cache miss for ${cuisine} menu, fetching from base service`);
    const result = await this.baseMenuService.getMenuByCuisine(cuisine);
    this.setCache(cacheKey, result);
    return result;
  }

  async isMenuItemAvailable(id: number): Promise<boolean> {
    const cacheKey = this.getCacheKey('isMenuItemAvailable', id);
    const cached = this.getCache<boolean>(cacheKey);
    
    if (cached !== null) {
      console.log(`CachedMenuService: Returning cached availability for item ${id}`);
      return cached;
    }

    console.log(`CachedMenuService: Cache miss for availability ${id}, fetching from base service`);
    const result = await this.baseMenuService.isMenuItemAvailable(id);
    this.setCache(cacheKey, result, 30000); // Shorter TTL for availability
    return result;
  }

  async updateMenuItemAvailability(id: number, available: boolean): Promise<void> {
    console.log(`CachedMenuService: Updating availability for item ${id} and clearing related cache`);
    
    // Update via base service
    await this.baseMenuService.updateMenuItemAvailability(id, available);
    
    // Clear related cache entries
    this.invalidateMenuCaches(id);
  }

  private invalidateMenuCaches(menuItemId?: number): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      // Clear all menu-related caches when any item changes
      if (key.includes('getAvailableMenuItems') || 
          key.includes('getMenuByCuisine') ||
          (menuItemId && key.includes(`getMenuItemById:${menuItemId}`)) ||
          (menuItemId && key.includes(`isMenuItemAvailable:${menuItemId}`))) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`CachedMenuService: Invalidated ${keysToDelete.length} cache entries`);
  }

  // Additional cache management methods
  clearAllCache(): void {
    this.cache.clear();
    console.log('CachedMenuService: All cache cleared');
  }

  getCacheStats() {
    return {
      totalEntries: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        expired: this.isExpired(entry)
      }))
    };
  }
}