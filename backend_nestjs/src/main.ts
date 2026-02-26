import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // para leer las cookies de las requests


  //habiliar validación global de DTOs con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  // Configurar CORS para permitir solicitudes desde el frontend
  app.enableCors({
    origin: process.env.URL_FRONTEND?.replace(/\/$/, ''),
    credentials: true,
  });

  app.setGlobalPrefix('api'); //todas las apis con /api

  // fallback para rutas de React al recargar
  app.use((req: any, res: any, next: any) => {
    if (!req.url.startsWith('/api') && !req.url.includes('.')) {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    } else {
      next();
    }
  });




  await app.listen(process.env.PORT ?? 3000);
  console.log(`Servidor corriendo en el puerto: ${process.env.PORT ?? 3000}`);
}
bootstrap();


/*
npm install cookie-parser
npm install @types/cookie-parser --save-dev
npm install @nestjs/serve-static
*/