import { UserRole } from '../../../core/common/enums/roles.enum';
import { Obligatorio, Opcional } from "src/core/common/validaciones.dto";


export class LoginDTO {

  @Obligatorio('username')
  'username': string;

  @Obligatorio('password')
  'password': string;

  @Opcional()
  'roles': UserRole[];
}