import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from 'src/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  await app.listen(envs.port);

  logger.log(`Gateway is running on: ${envs.port}`);
}
bootstrap();
