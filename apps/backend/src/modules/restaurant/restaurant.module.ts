import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

// Menu sub-module
import { MenuController } from './menu/controllers/menu.controller';
import { MenuService } from './menu/services/menu.service';
import { MenuRepository } from './menu/repositories/menu.repository';

// Order sub-module
import { OrderController } from './order/controllers/order.controller';
import { OrderService } from './order/services/order.service';
import { OrderRepository } from './order/repositories/order.repository';

// Admin sub-module
import { AdminController } from './admin/controllers/admin.controller';
import { AdminService } from './admin/services/admin.service';

@Module({
  imports: [SharedModule],
  controllers: [
    MenuController,
    OrderController,
    AdminController,
  ],
  providers: [
    // Menu providers
    MenuService,
    MenuRepository,
    
    // Order providers
    OrderService,
    OrderRepository,
    
    // Admin providers
    AdminService,
  ],
  exports: [
    MenuService,
    OrderService,
    AdminService,
  ],
})
export class RestaurantModule {}