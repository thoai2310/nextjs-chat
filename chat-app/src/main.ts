import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors('*');
  app.enableCors({
    origin: 'http://localhost:3000', // <== KHÔNG DÙNG '*'
    credentials: true, // <== Cho phép cookie
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
