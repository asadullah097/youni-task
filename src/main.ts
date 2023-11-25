import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.DB_PORT, 'ddd');

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Youni Task')
    .setDescription('The Youni API description')
    .setVersion('1.0')
    .addTag('youni')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
