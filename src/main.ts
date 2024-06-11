import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // make "/api" prefix for all routes
  app.setGlobalPrefix('api');
  await app.listen(3000 || process.env.PORT);
}
bootstrap();
