import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import type { LoginDTO } from './dto/login.dto';
import { CodificadorService } from '../../core/common/codificador.service';


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly codificador: CodificadorService,
  ) { }


  // valida credenciales, devuelve el perfil y guarda el JWT en cookie HttpOnly
  async login(loginDto: LoginDTO, res: Response): Promise<{ user: object }> {
    try {
      const { username, password } = loginDto;

      if (!username || !password) {
        throw new BadRequestException('Ingresa los datos completos: username y password');
      }

      let user: any;
      try {
        const result = await this.entityManager.query('CALL IniciarSesion(?, ?)', [username, password]);
        user = result?.[0]?.[0];
      } catch (error) {
        console.error('Error en DB al iniciar sesión:', error);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!user || Number(user.cod) !== 1) {
        throw new UnauthorizedException(user?.mensaje ?? 'Credenciales inválidas');
      }

      const access_token = this.jwtService.sign({
        id: user.id,
        name: user.nombres,
        roles: user.tipo_usuario,
      });

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 60 * 8,
      });

      return {
        user: {
          id: user.id,
          name: user.nombres,
          roles: user.tipo_usuario,
        }
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error inesperado en login:', error);
      throw new InternalServerErrorException('Ocurrió un error al iniciar sesión');
    }
  }



  //— elimina la cookie del JWT para cerrar la sesión
  logout(res: Response): { message: string } {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    return { message: 'Sesión cerrada' };
  }
}