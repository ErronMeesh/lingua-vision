import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Lingvo Vision API')
    .setDescription('API для дипломного проекта по контекстному изучению языка')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: [
      'https://erronmeeshproject.nomorepartiessite.ru',
      'http://localhost:5173',
      'http://localhost:8081',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Бэкенд запущен на http://localhost:${port}`);
  console.log(
    `📚 Документация Swagger доступна на http://localhost:${port}/api/docs`,
  );
}
bootstrap().catch((err) => console.error(err));
