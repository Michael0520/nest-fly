export interface RestaurantConfig {
  name: string;
  maxOrdersPerHour: number;
  operatingHours: {
    open: string;
    close: string;
  };
  features: {
    onlineOrdering: boolean;
    delivery: boolean;
    reservations: boolean;
  };
  currency: string;
  supportedLanguages: string[];
}

export class RestaurantConfigService {
  constructor(private readonly config: RestaurantConfig) {}

  getRestaurantName(): string {
    return this.config.name;
  }

  getMaxOrdersPerHour(): number {
    return this.config.maxOrdersPerHour;
  }

  getOperatingHours() {
    return this.config.operatingHours;
  }

  isFeatureEnabled(feature: keyof RestaurantConfig['features']): boolean {
    return this.config.features[feature];
  }

  getCurrency(): string {
    return this.config.currency;
  }

  getSupportedLanguages(): string[] {
    return this.config.supportedLanguages;
  }

  // Business logic methods using configuration
  canAcceptMoreOrders(currentOrders: number): boolean {
    return currentOrders < this.config.maxOrdersPerHour;
  }

  isOperatingNow(): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    return currentTime >= this.config.operatingHours.open && 
           currentTime <= this.config.operatingHours.close;
  }

  getFullConfig(): RestaurantConfig {
    return { ...this.config };
  }
}