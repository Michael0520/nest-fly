import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Optimize for serverless
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Add connection management for serverless
  async enableShutdownHooks(app: any) {
    // Handle graceful shutdown for serverless environments
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}
