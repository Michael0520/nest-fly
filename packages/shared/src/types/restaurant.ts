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

export interface CreateOrderDto {
  tableNumber: number;
  items: OrderItem[];
}

export interface UpdateOrderStatusDto {
  status: Order['status'];
}