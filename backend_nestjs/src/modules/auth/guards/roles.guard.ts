import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from '../../../core/common/enums/roles.enum';
import { BaseAuthGuard } from './base-auth.guard';


/**
 * Verifica que el usuario tenga al menos uno de los roles definidos con @Roles('administrador','editor').
 * Si la ruta no tiene roles declarados, permite el acceso sin restricción.
 */
@Injectable()
export class RolesGuard extends BaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    jwtService: JwtService,
  ) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lee los roles requeridos del decorador @Roles(), buscando primero en el método y luego en la clase
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene @Roles(), no hay restricción de acceso
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<Request>();

    // Busca el token en cookie HttpOnly o header Authorization
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    // Verifica la firma y expiración del token; devuelve los datos del usuario (id, roles, etc.)
    const payload = await this.verifyToken(token);

    // Normaliza los roles del payload a un array, ya que el JWT puede traerlos como string o string[]
    let userRoles: UserRole[] = [];
    if (Array.isArray(payload.roles)) {
      userRoles = payload.roles;
    } else if (typeof payload.roles === 'string') {
      userRoles = [payload.roles as UserRole];
    } else {
      throw new UnauthorizedException('Roles del usuario inválidos');
    }

    // Verifica que el usuario tenga al menos uno de los roles requeridos
    if (!requiredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }

    return true;
  }
}