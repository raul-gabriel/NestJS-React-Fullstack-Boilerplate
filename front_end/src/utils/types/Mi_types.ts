
export const estadoSelect = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" }
];


export const tipoUsuario = [
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Cliente', label: 'Cliente' },
] as const;

export type TipoUsuario = typeof tipoUsuario[number]['value'];

export interface Usuario {
  id: number;
  nombres: string;
  email: string | null;
  telefono?: string | null;
  password: string | null;
  tipo_usuario: TipoUsuario | null;
  estado: 'activo' | 'inactivo';
}