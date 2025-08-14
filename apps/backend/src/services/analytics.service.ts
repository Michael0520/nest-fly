import { Injectable } from '@nestjs/common';

export interface AnalyticsConfig {
  apiKey: string;
  endpoint: string;
  batchSize: number;
  flushInterval: number;
  enabled: boolean;
}

export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  userId?: string;
  properties: Record<string, any>;
}

@Injectable()
export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(private readonly config: AnalyticsConfig) {
    console.log('AnalyticsService: Initialized with config', {
      endpoint: config.endpoint,
      batchSize: config.batchSize,
      enabled: config.enabled
    });

    if (config.enabled) {
      this.startFlushTimer();
    }
  }

  async trackEvent(event: string, properties: Record<string, any> = {}, userId?: string): Promise<void> {
    if (!this.config.enabled) {
      console.log(`AnalyticsService: Tracking disabled, skipping event: ${event}`);
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      userId,
      properties
    };

    this.events.push(analyticsEvent);
    console.log(`AnalyticsService: Event tracked: ${event}`, properties);

    if (this.events.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  async trackOrderCreated(orderId: number, customerName: string, totalPrice: number, itemCount: number): Promise<void> {
    await this.trackEvent('order_created', {
      orderId,
      customerName,
      totalPrice,
      itemCount,
      currency: 'TWD'
    });
  }

  async trackOrderStatusChanged(orderId: number, oldStatus: string, newStatus: string): Promise<void> {
    await this.trackEvent('order_status_changed', {
      orderId,
      oldStatus,
      newStatus,
      transitionTime: new Date().toISOString()
    });
  }

  async trackMenuView(cuisine?: string): Promise<void> {
    await this.trackEvent('menu_viewed', {
      cuisine: cuisine || 'all',
      viewTime: new Date().toISOString()
    });
  }

  async trackMenuItemView(itemId: number, itemName: string, cuisine: string): Promise<void> {
    await this.trackEvent('menu_item_viewed', {
      itemId,
      itemName,
      cuisine
    });
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) {
      return;
    }

    const eventsToFlush = [...this.events];
    this.events = [];

    try {
      console.log(`AnalyticsService: Flushing ${eventsToFlush.length} events to ${this.config.endpoint}`);
      
      // Simulate API call - in real implementation this would be an HTTP request
      await this.sendEventsToAPI(eventsToFlush);
      
      console.log(`AnalyticsService: Successfully flushed ${eventsToFlush.length} events`);
    } catch (error) {
      console.error('AnalyticsService: Failed to flush events', error);
      // In production, you might want to implement retry logic or save to persistent storage
      this.events.unshift(...eventsToFlush); // Re-add failed events to retry later
    }
  }

  private async sendEventsToAPI(events: AnalyticsEvent[]): Promise<void> {
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional failures for demonstration
        if (Math.random() < 0.1) {
          reject(new Error('Simulated API failure'));
        } else {
          resolve();
        }
      }, 100 + Math.random() * 200); // 100-300ms delay
    });
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush().catch(error => {
        console.error('AnalyticsService: Scheduled flush failed', error);
      });
    }, this.config.flushInterval);

    console.log(`AnalyticsService: Flush timer started with ${this.config.flushInterval}ms interval`);
  }

  async getStats() {
    return {
      pendingEvents: this.events.length,
      config: {
        enabled: this.config.enabled,
        batchSize: this.config.batchSize,
        flushInterval: this.config.flushInterval
      },
      recentEvents: this.events.slice(-5) // Last 5 events for debugging
    };
  }

  async shutdown(): Promise<void> {
    console.log('AnalyticsService: Shutting down...');
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Flush any remaining events
    if (this.events.length > 0) {
      await this.flush();
    }

    console.log('AnalyticsService: Shutdown complete');
  }
}

// Factory function for creating analytics service with async initialization
export async function createAnalyticsService(): Promise<AnalyticsService> {
  console.log('Creating AnalyticsService with async initialization...');
  
  // Simulate loading configuration from external source
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const config: AnalyticsConfig = {
    apiKey: process.env.ANALYTICS_API_KEY || 'demo-key',
    endpoint: process.env.ANALYTICS_ENDPOINT || 'https://api.analytics.example.com/events',
    batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE || '10'),
    flushInterval: parseInt(process.env.ANALYTICS_FLUSH_INTERVAL || '30000'), // 30 seconds
    enabled: process.env.NODE_ENV !== 'test' && process.env.ANALYTICS_ENABLED !== 'false'
  };

  console.log('AnalyticsService: Configuration loaded', {
    endpoint: config.endpoint,
    enabled: config.enabled
  });

  return new AnalyticsService(config);
}