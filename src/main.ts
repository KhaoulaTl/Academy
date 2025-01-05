/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const apiPrefix = configService.get<string>('API_PREFIX');

  app.setGlobalPrefix(apiPrefix || 'api');
  app.enableCors({
    origin: frontendUrl || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(port || 3001);
  console.log(`Server is running on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
