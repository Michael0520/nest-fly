import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'NestJS Restaurant API',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT || '3001', 10),
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
    origin: process.env.CORS_ORIGIN || '*',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    title: 'Restaurant Management API',
    description: 'A learning project for NestJS best practices',
    version: '1.0',
    path: process.env.SWAGGER_PATH || 'docs',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
}));