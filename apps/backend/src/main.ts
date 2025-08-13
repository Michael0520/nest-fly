import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('International Restaurant API')
    .setDescription('A NestJS learning example - Restaurant management system')
    .setVersion('1.0')
    .addTag('restaurant', 'Restaurant operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Restaurant API',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🍽️ Restaurant app running on http://localhost:${port}`);
  console.log(
    `📖 Swagger documentation available at http://localhost:${port}/api`,
  );
}

void bootstrap();
