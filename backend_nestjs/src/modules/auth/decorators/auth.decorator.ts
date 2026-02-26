import { UserRole } from '../../../core/common/enums/roles.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { applyDecorators, UseGuards } from '@nestjs/common';

// Modificar la función Auth para aceptar un array de roles @Auth('admin', 'user') o @Auth('admin')
export function Auth(...roles: UserRole[]) {
  // Aplicar los roles al decorador Roles utilizando un spread operator
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
}
