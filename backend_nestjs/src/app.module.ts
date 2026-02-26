// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from './core/config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [

    //configuracion de la base de datos
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UsuariosModule,


    // archivos estáticos mostrar pagina de react
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'public'),
        serveRoot: '/',
        exclude: ['/api*'],
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }