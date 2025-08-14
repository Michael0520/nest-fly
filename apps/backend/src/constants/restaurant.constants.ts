// Restaurant business constants
export const RESTAURANT_CONSTANTS = {
  ORDER_STATUS_TRANSITIONS: {
    PENDING: ['PREPARING'] as const,
    PREPARING: ['READY'] as const,
    READY: ['SERVED'] as const,
    SERVED: [] as const
  },
  PRICING: {
    TAX_RATE: 0.08,
    DELIVERY_FEE: 50,
    SERVICE_CHARGE_RATE: 0.10
  },
  BUSINESS_RULES: {
    MAX_ITEMS_PER_ORDER: 20,
    MIN_ORDER_AMOUNT: 100,
    LOYALTY_POINTS_RATE: 1, // 1 point per dollar
    ORDER_TIMEOUT_MINUTES: 30
  },
  MESSAGES: {
    ORDER_CREATED: 'Your order has been placed successfully!',
    ORDER_PREPARING: 'Your order is being prepared.',
    ORDER_READY: 'Your order is ready for pickup!',
    ORDER_SERVED: 'Thank you for dining with us!'
  }
} as const;

// Utility functions that will be provided as values
export const RESTAURANT_UTILS = {
  formatPrice: (price: number, currency = 'TWD'): string => {
    return `${currency} ${price.toLocaleString()}`;
  },
  
  calculateTax: (amount: number): number => {
    return Math.round(amount * RESTAURANT_CONSTANTS.PRICING.TAX_RATE);
  },
  
  calculateServiceCharge: (amount: number): number => {
    return Math.round(amount * RESTAURANT_CONSTANTS.PRICING.SERVICE_CHARGE_RATE);
  },
  
  calculateTotalWithTaxAndService: (subtotal: number): number => {
    const tax = RESTAURANT_UTILS.calculateTax(subtotal);
    const service = RESTAURANT_UTILS.calculateServiceCharge(subtotal);
    return subtotal + tax + service;
  },
  
  generateOrderNumber: (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  },
  
  validateOrderStatus: (currentStatus: string, newStatus: string): boolean => {
    type StatusKey = keyof typeof RESTAURANT_CONSTANTS.ORDER_STATUS_TRANSITIONS;
    const allowedTransitions = RESTAURANT_CONSTANTS.ORDER_STATUS_TRANSITIONS[currentStatus as StatusKey];
    if (!allowedTransitions) return false;
    return allowedTransitions.includes(newStatus as never);
  },
  
  formatOrderTime: (date: Date): string => {
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  },
  
  calculateLoyaltyPoints: (amount: number): number => {
    return Math.floor(amount * RESTAURANT_CONSTANTS.BUSINESS_RULES.LOYALTY_POINTS_RATE);
  }
} as const;

// Provider tokens for dependency injection
export const RESTAURANT_CONFIG_TOKEN = Symbol('RESTAURANT_CONFIG');
export const RESTAURANT_CONSTANTS_TOKEN = Symbol('RESTAURANT_CONSTANTS');
export const RESTAURANT_UTILS_TOKEN = Symbol('RESTAURANT_UTILS');