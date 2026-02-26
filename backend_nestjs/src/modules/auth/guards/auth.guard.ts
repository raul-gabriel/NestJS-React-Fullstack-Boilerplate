import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BaseAuthGuard } from './base-auth.guard';


/**
 * Verifica que la request tenga un JWT válido e inyecta el payload en `request.user`.
 */
@Injectable()
export class AuthGuard extends BaseAuthGuard implements CanActivate {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtiene la request HTTP del contexto de ejecución de NestJS
    const request = context.switchToHttp().getRequest<Request>();

    // Busca el token en cookie HttpOnly o header Authorization
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Usuario no autenticado');

    // Verifica la firma y expiración del token; devuelve los datos del usuario (id, roles, etc.)
    const payload = await this.verifyToken(token);

    // Adjunta el payload a la request para que esté disponible en controladores y otros guards
    (request as any).user = payload;

    return true;
  }
}