import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tusuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  nombres!: string;

  @Column({ length: 100, unique: true, nullable: true })
  email!: string;

  @Column({ length: 9, nullable: true })
  telefono!: string;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado!: string;

  @Column({ type: 'text', nullable: true })
  password!: string;

  @Column({ length: 15, nullable: true })
  tipo_usuario!: string;
}