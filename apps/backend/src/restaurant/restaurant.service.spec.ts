import { RestaurantService } from './restaurant.service';

describe('RestaurantService', () => {
  let service: RestaurantService;

  beforeEach(() => {
    service = new RestaurantService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 3 menu items', () => {
    const menu = service.getFullMenu();
    expect(menu).toHaveLength(3);
  });

  it('should find menu item by ID', () => {
    const item = service.getMenuItemById(1);
    expect(item?.name).toBe('Sushi Platter');
    expect(item?.price).toBe(380);
  });

  it('should create order', () => {
    const order = service.createOrder('Test Customer', [1, 2]);
    expect(order).not.toBeNull();
    expect(order?.customerName).toBe('Test Customer');
    expect(order?.totalPrice).toBe(700);
  });

  it('should get statistics', () => {
    const stats = service.getRestaurantStats();
    expect(stats.totalMenuItems).toBe(3);
    expect(stats.totalOrders).toBe(0);
    expect(stats.totalRevenue).toBe(0);
  });
});
