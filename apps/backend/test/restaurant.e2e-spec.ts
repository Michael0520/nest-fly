import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Restaurant E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) should return welcome message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toContain(
          'Welcome to our international restaurant',
        );
      });
  });

  it('/restaurant/menu (GET) should return menu', () => {
    return request(app.getHttpServer())
      .get('/restaurant/menu')
      .expect(200)
      .then((response) => {
        expect(response.body.menu).toHaveLength(3);
      });
  });

  it('/restaurant/order (POST) should create order', () => {
    return request(app.getHttpServer())
      .post('/restaurant/order')
      .send({
        customerName: 'E2E Test Customer',
        itemIds: [1, 2],
      })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.order.totalPrice).toBe(700);
      });
  });

  it('/restaurant/stats (GET) should return statistics', () => {
    return request(app.getHttpServer())
      .get('/restaurant/stats')
      .expect(200)
      .then((response) => {
        expect(response.body.stats.totalMenuItems).toBe(3);
      });
  });
});
