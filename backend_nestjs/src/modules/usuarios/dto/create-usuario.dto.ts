import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { Maximo, Obligatorio, Opcional } from "src/core/common/validaciones.dto";

export class CreateUsuarioDto {

  @Obligatorio('nombres')
  @Maximo(50, 'nombres')
  nombres!: string;

  @Obligatorio('email')
  @Maximo(100, 'email')
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @Opcional()
  @Maximo(9, 'telefono')
  telefono?: string;

  @Obligatorio('password')
  @Maximo(20, 'password')
  password!: string;

  @Obligatorio('estado')
  @Maximo(15, 'estado')
  @Transform(({ value }) => value?.toLowerCase())  // Convertir a minúsculas para validación
  estado!: 'activo' | 'inactivo';


  @Obligatorio('tipo_usuario')
  @Maximo(15, 'tipo_usuario')
  @Transform(({ value }) => value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase()) // Capitalizar la primera letra para validación
  tipo_usuario!: 'Administrador' | 'Editor' | 'Cliente';
}




//dto solo para actualziar el correo y password
export class ActualizarPerfilDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  password_actual?: string;
}