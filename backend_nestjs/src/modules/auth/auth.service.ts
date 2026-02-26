import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    const { username, password } = loginDto;

    if (!username || !password) {
      throw new BadRequestException('Ingresa los datos completos: username y password');
    }

    let user: any;
    try {
      //llamar al procedimiento almacenado IniciarSesion 
      const result = await this.entityManager.query('CALL IniciarSesion(?, ?)', [username, password]);
      user = result?.[0]?.[0];
    } catch {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    //verificar la sesion del usuario|| cod=1 significa login exitoso, cod=0 credenciales inválidas o usuario inactivo
    if (!user || Number(user.cod) !== 1) {
      throw new UnauthorizedException(user?.mensaje ?? 'Credenciales inválidas');
    }

    //generar el token
    const access_token = this.jwtService.sign({
      id: user.id,
      name: user.nombres,
      roles: user.tipo_usuario,
    });

    // Guarda el token en cookie HttpOnly
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 8, // 8 horas en milisegundos
    });

    //retornar datos del usuario para el frontend
    return {
      user: {
        id: user.id,
        name: user.nombres,
        roles: user.tipo_usuario,
      }
    };
  }



  //— elimina la cookie del JWT para cerrar la sesión
  logout(res: Response): { message: string } {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { message: 'Sesión cerrada' };
  }
}