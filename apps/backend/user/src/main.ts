import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';

const setupSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('User')
    .setDescription('The user API description')
    .setVersion('0.0.1')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, swaggerDocument, {
    customSiteTitle: 'User API',
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ['log', 'warn', 'error'],
    httpsOptions: {
      cert: readFileSync(process['env']['SSL_CERT_PATH']),
      key: readFileSync(process['env']['SSL_KEY_PATH']),
    },
  });

  app.disable('x-powered-by'); // Preventing exposure of used technology by disabling 'X-Powered-By' header

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setupSwagger(app);

  const port = process['env']['PORT'] || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: https://localhost:${port}`);
}

bootstrap();
