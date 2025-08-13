export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  cuisine: 'japanese' | 'italian' | 'general';
}

export interface Order {
  id: number;
  items: MenuItem[];
  totalPrice: number;
  customerName: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  orderTime: Date;
}
