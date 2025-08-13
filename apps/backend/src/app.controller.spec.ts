import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return welcome message with available routes', () => {
      const result = appController.getWelcome();
      expect(result.message).toBe(
        '🍽️ Welcome to our international restaurant! This is a NestJS learning example application.',
      );
      expect(result.availableRoutes).toBeDefined();
      expect(result.availableRoutes['menu']).toBe('GET /restaurant/menu');
    });
  });
});
