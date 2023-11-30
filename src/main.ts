import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { check } from 'tcp-port-used';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SSI Calls using AFJ')
    .setDescription('The SSI API description')
    .setVersion('1.0')
    .addTag('ssi')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    allowedHeaders: 'X-Total-Count, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  }
  );
  console.log("Port 3000 in use?", await check(3000))
  console.log("Use this port instead ", await check(3000)?3001:3000)
  await app.listen(await check(3000)?3001:3000);
}
bootstrap();
