import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ActualizarPerfilDto, CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UserRole } from 'src/core/common/enums/roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';


//@Auth(UserRole.ADMIN)  //proteger toda la api
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }



  @Auth()
  @Patch('perfil/:id')
  actualizarPerfil(@Param('id') id: string, @Body() dto: ActualizarPerfilDto) {
    return this.usuariosService.actualizarPerfil(+id, dto);
  }

  //crud
  @Auth(UserRole.ADMIN)
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }


  @Auth(UserRole.ADMIN)
  @Get()
  async findAll(@Query('buscar') buscar?: string) {
    return this.usuariosService.findAll(buscar);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }



}



/*
@Auth(UserRole.ADMIN,UserRole.EDITOR)  permiso solo administrador   y editor  
@Auth()  debe iniciar sesion

*/
