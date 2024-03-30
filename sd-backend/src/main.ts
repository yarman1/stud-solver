import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as process from "process";
import * as cookieParser from "cookie-parser";
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true , transform: true}));
  app.use(cookieParser());
  app.setViewEngine('ejs');
  app.enableCors({credentials: true, origin: 'http://localhost:3000'});

  const config = new DocumentBuilder()
      .setTitle('StudSolver')
      .setDescription('Math api')
      .setVersion('1.0')
      .addTag('studs')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
