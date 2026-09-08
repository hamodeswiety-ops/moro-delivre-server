import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'frontend'), {
    prefix: '/home-decor',
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Moro Delivre API')
    .setDescription('Multi-store shipping application API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API documentation: http://localhost:${port}/api/docs`);
    console.log(`🏠 Home Decor App: http://localhost:${port}/home-decor/index.html`);
  });
}

bootstrap();
