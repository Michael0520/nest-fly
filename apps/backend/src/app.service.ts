import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🍽️ Welcome to our international restaurant! This is a NestJS learning example application.';
  }
}
