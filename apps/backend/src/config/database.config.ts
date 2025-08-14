import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  type: 'postgresql',
  logging: process.env.NODE_ENV !== 'production',
  synchronize: process.env.NODE_ENV === 'development',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN || '0', 10),
    max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
  },
  retryAttempts: parseInt(process.env.DATABASE_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(process.env.DATABASE_RETRY_DELAY || '3000', 10),
}));