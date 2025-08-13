import { api } from './config';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: number;
  tableNumber: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export const restaurantApi = {
  // Menu APIs
  getMenu: async (): Promise<MenuItem[]> => {
    const response = await api.get('/restaurant/menu');
    return response.data;
  },

  // Order APIs
  createOrder: async (orderData: { tableNumber: number; items: OrderItem[] }): Promise<Order> => {
    const response = await api.post('/restaurant/orders', orderData);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/restaurant/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get(`/restaurant/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/restaurant/orders/${id}/status`, { status });
    return response.data;
  },
};

export default restaurantApi;