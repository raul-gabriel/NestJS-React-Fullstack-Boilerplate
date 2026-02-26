import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../core/common/enums/roles.enum';


//agrega todos los roles en un array
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);