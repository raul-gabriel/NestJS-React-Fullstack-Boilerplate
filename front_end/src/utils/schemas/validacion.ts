import { z } from 'zod';


export const UsuarioSchema = z.object({
  nombres: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  email: z.string().min(1, 'Ingrese un email válido').max(100).email('Ingrese un email válido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio').length(9, 'El teléfono debe tener 9 dígitos'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  tipo_usuario: z.enum(['Administrador', 'Editor', 'Cliente'], { message: 'Seleccione un rol válido' }),
  estado: z.enum(['activo', 'inactivo'], { message: 'Seleccione un estado válido' }),
});

export type UsuarioForm = z.infer<typeof UsuarioSchema>;