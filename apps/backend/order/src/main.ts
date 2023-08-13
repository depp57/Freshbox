import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';

const setupSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Order')
    .setDescription('The order API description')
    .setVersion('0.0.1')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, swaggerDocument, {
    customSiteTitle: 'Order API',
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

  const port = process['env']['PORT'] || 3001;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: https://localhost:${port}`);
}

bootstrap();
