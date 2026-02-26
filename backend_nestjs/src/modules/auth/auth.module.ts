import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { CodificadorService } from 'src/core/common/codificador.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true, // Disponible en todos los módulos sin necesidad de importarlo en cada uno
      secret: process.env.JWT_SECRET || '9756947257', // clase secreta para firmar los tokens
      signOptions: { expiresIn: '8h' }, // tiempo de expiración del token
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RolesGuard,
    CodificadorService,
  ],
  exports: [
    JwtModule,
    AuthService,
    RolesGuard,
    CodificadorService,
  ],
})
export class AuthModule { }