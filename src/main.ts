import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO 에 작성된 값만 수신
      forbidNonWhitelisted: true, // DTO 에 필수 값이 안들어오면 막기
      transform: true, // DTO Type 에 맞게 수신 값 변경
    }),
  );

  app.enableCors({
    origin: ['https://prlc.kr', 'http://localhost:3001'],
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });

  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());

  await app.listen(3000);
}

bootstrap();
