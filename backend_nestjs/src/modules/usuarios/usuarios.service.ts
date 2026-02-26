import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ActualizarPerfilDto, CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Like, Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) { }


  async findAll(buscar?: string) {
    const where = buscar
      ? [
        { nombres: Like(`%${buscar}%`) },
        { email: Like(`%${buscar}%`) },
      ]
      : {};

    return await this.repo.find({
      select: ['id', 'nombres', 'email', 'telefono', 'estado', 'tipo_usuario'],
      where,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'nombres', 'email', 'telefono', 'estado', 'tipo_usuario'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }



  async create(dto: CreateUsuarioDto) {
    if (await this.repo.findOne({ where: { email: dto.email } })) {
      throw new ConflictException('El correo ya está registrado');
    }

    const usuario = this.repo.create({
      ...dto,
      password: dto.password
        ? crypto.createHash('sha256').update(dto.password).digest('hex')
        : undefined,
    });

    await this.repo.save(usuario);
    return { message: 'Usuario registrado con éxito' };
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== user.email) {
      if (await this.repo.findOne({ where: { email: dto.email } })) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    if (dto.password && dto.password !== '__SIN_CAMBIO__') {
      dto.password = crypto.createHash('sha256').update(dto.password).digest('hex');
    } else {
      delete dto.password; // no toca el password
    }

    Object.assign(user, dto);
    await this.repo.save(user);
    return { message: 'Usuario modificado con éxito' };
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    try {
      await this.repo.remove(user);
      return { message: 'Usuario eliminado' };
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
        return { message: 'No se puede eliminar porque este Registro está relacionado con otros registros' };
      }
      throw error;
    }
  }



  async actualizarPerfil(id: number, dto: ActualizarPerfilDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // verificar password actual antes de cualquier cambio
    if (dto.password || dto.email) {
      if (!dto.password_actual) {
        throw new BadRequestException('Debes ingresar tu contraseña actual para realizar cambios');
      }

      const passwordActualHash = crypto.createHash('sha256').update(dto.password_actual).digest('hex');
      if (user.password !== passwordActualHash) {
        throw new ConflictException('La contraseña actual es incorrecta');
      }
    }

    if (dto.email && dto.email !== user.email) {
      if (await this.repo.findOne({ where: { email: dto.email } })) {
        throw new ConflictException('El correo ya está registrado');
      }
      user.email = dto.email;
    }

    if (dto.password) {
      user.password = crypto.createHash('sha256').update(dto.password).digest('hex');
    }

    await this.repo.save(user);
    return { message: 'Perfil actualizado con éxito' };
  }

}