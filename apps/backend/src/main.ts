import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Imoya Flow Backend running on port ${port}`);
  console.log(`📊 API available at http://localhost:${port}`);
  console.log(`🔗 Webhooks available at http://localhost:${port}/webhooks`);
}
bootstrap();
