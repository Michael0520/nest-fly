import { Test } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

describe('RestaurantController', () => {
  let controller: RestaurantController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [RestaurantService],
    }).compile();

    controller = module.get(RestaurantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return menu', () => {
    const result = controller.getMenu();
    expect(result.message).toContain('Welcome to our international restaurant');
    expect(result.menu).toHaveLength(3);
  });

  it('should return specific menu item', () => {
    const result = controller.getMenuItem('1');
    expect(result.success).toBe(true);
    expect(result.item?.name).toBe('Sushi Platter');
  });

  it('should create order', () => {
    const result = controller.createOrder({
      customerName: 'Test Customer',
      itemIds: [1],
    });
    expect(result.success).toBe(true);
    expect(result.order?.customerName).toBe('Test Customer');
  });

  it('should return statistics', () => {
    const result = controller.getStats();
    expect(result.message).toBe('Restaurant operation statistics');
    expect(result.stats.totalMenuItems).toBe(3);
  });
});
