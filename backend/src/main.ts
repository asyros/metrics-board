import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Vite dev server
    // credentials: true, // only needed if you later use cookies
  });

  await app.listen(3000);
}
bootstrap();
