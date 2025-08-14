import { Module } from '@nestjs/common';
import { RestaurantConfigService, RestaurantConfig } from '../config/restaurant-config.service';
import { 
  RESTAURANT_CONSTANTS, 
  RESTAURANT_UTILS,
  RESTAURANT_CONFIG_TOKEN,
  RESTAURANT_CONSTANTS_TOKEN,
  RESTAURANT_UTILS_TOKEN
} from '../constants/restaurant.constants';
import { MENU_SERVICE_TOKEN } from '../services/menu.service.interface';
import { DatabaseMenuService } from '../services/database-menu.service';
import { CachedMenuService } from '../services/cached-menu.service';
import { AnalyticsService, createAnalyticsService } from '../services/analytics.service';
import { PrismaService } from '../prisma/prisma.service';

// Factory function for creating restaurant configuration
function createRestaurantConfig(): RestaurantConfig {
  console.log('Creating restaurant configuration with useFactory...');
  
  return {
    name: process.env.RESTAURANT_NAME || 'NestJS Learning Restaurant',
    maxOrdersPerHour: parseInt(process.env.MAX_ORDERS_PER_HOUR || '100'),
    operatingHours: {
      open: process.env.RESTAURANT_OPEN_HOUR || '09:00',
      close: process.env.RESTAURANT_CLOSE_HOUR || '22:00'
    },
    features: {
      onlineOrdering: process.env.ONLINE_ORDERING_ENABLED !== 'false',
      delivery: process.env.DELIVERY_ENABLED === 'true',
      reservations: process.env.RESERVATIONS_ENABLED === 'true'
    },
    currency: process.env.CURRENCY || 'TWD',
    supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'zh-TW,en-US').split(',')
  };
}

@Module({
  imports: [],
  providers: [
    // 1. useFactory pattern - Creates configuration dynamically
    {
      provide: RESTAURANT_CONFIG_TOKEN,
      useFactory: createRestaurantConfig,
    },
    
    // 2. useFactory with dependencies - Configuration service that depends on config
    {
      provide: RestaurantConfigService,
      useFactory: (config: RestaurantConfig) => {
        console.log('Creating RestaurantConfigService with injected config');
        return new RestaurantConfigService(config);
      },
      inject: [RESTAURANT_CONFIG_TOKEN],
    },
    
    // 3. useValue pattern - Provide constants and utilities as static values
    {
      provide: RESTAURANT_CONSTANTS_TOKEN,
      useValue: RESTAURANT_CONSTANTS,
    },
    {
      provide: RESTAURANT_UTILS_TOKEN,
      useValue: RESTAURANT_UTILS,
    },
    
    // 4. useClass pattern - Provide interface implementation
    // This demonstrates providing a base service for the decorator pattern
    {
      provide: MENU_SERVICE_TOKEN,
      useClass: DatabaseMenuService,
    },
    
    // 5. Alternative useClass with different implementation
    // Uncomment this and comment the above to use cached version
    // {
    //   provide: MENU_SERVICE_TOKEN,
    //   useClass: CachedMenuService,
    // },
    
    // 6. Complex factory for decorator pattern - Menu service with caching
    // This shows how to create a decorator service that wraps another service
    {
      provide: 'CACHED_MENU_SERVICE',
      useFactory: (baseMenuService: any) => {
        console.log('Creating CachedMenuService with injected base service');
        return new CachedMenuService(baseMenuService);
      },
      inject: [{ token: 'BASE_MENU_SERVICE', optional: false }],
    },
    
    // Base service for the cached decorator
    {
      provide: 'BASE_MENU_SERVICE',
      useClass: DatabaseMenuService,
    },
    
    // 7. Async provider - Service that requires async initialization
    {
      provide: AnalyticsService,
      useFactory: createAnalyticsService,
    },
    
    // 8. Existing service as dependency for other providers
    PrismaService,
  ],
  exports: [
    RestaurantConfigService,
    RESTAURANT_CONFIG_TOKEN,
    RESTAURANT_CONSTANTS_TOKEN,
    RESTAURANT_UTILS_TOKEN,
    MENU_SERVICE_TOKEN,
    'CACHED_MENU_SERVICE',
    AnalyticsService,
  ],
})
export class ProvidersModule {
  constructor() {
    console.log('ProvidersModule initialized with custom provider patterns');
  }
}