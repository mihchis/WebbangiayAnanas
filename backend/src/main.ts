import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // 1. Enable Global Validation Pipes for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip non-configured fields
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  // 2. Enable CORS for Frontend localhost integration
  app.enableCors({
    origin: '*', // In production, narrow this to the specific frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Serve the local uploads folder statically
  // Express maps "/uploads" path directly to the local directory inside the project root
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));
  console.log(`Statically serving uploads from: ${uploadsPath}`);

  await app.listen(port);
  console.log(`NestJS Backend Server successfully running on: http://localhost:${port}`);
}
bootstrap();
