import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';



/**
 * Lógica compartida de extracción y verificación JWT.
 * Los guards hijos solo definen su propio flujo en `canActivate`.
 */
@Injectable()
export class BaseAuthGuard {
    constructor(protected readonly jwtService: JwtService) { }

    protected extractToken(request: Request): string | undefined {
        // Cookie HttpOnly es más segura frente a XSS, tiene prioridad sobre el header
        if (request.cookies?.access_token) {
            return request.cookies.access_token;
        }
        // Fallback para clientes que envían el token en el header Authorization: Bearer <token>
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    protected async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('El token ha expirado');
            }
            throw new UnauthorizedException('Token inválido');
        }
    }
}