# NestJS backend

API REST construida con NestJS, TypeORM y MySQL. Incluye autenticación JWT con cookies HttpOnly y control de acceso por roles.

---

# Librerias Usadas
instala estas librerias si vas a usarlo en un proyecto limpio.

```bash
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/jwt
npm install class-validator class-transformer
npm install @nestjs/config
npm install cookie-parser
npm install @types/cookie-parser --save-dev
npm install @nestjs/serve-static
```

---

## Estructura relevante

| Archivo | Descripción |
|---|---|
| `src/core/config/database.config.ts` | Configuración de conexión MySQL con TypeORM |
| `src/core/common/enums/roles.enum.ts` | Roles disponibles para control de acceso |
| `src/core/common/validaciones.dto.ts` | Decoradores personalizados para validar DTOs |
| `src/core/common/codificador.service.ts` | Métodos para encriptar y desencriptar datos |
| `src/modules/auth/guards/auth.guard.ts` | Verifica que el usuario tenga sesión activa |
| `src/modules/auth/guards/roles.guard.ts` | Verifica sesión y permisos por rol |
| `src/modules/auth/auth.service.ts` | Lógica de inicio y cierre de sesión |

---

## Autenticación

### Login
```http
POST /api/auth/login
Content-Type: application/json

{ "username": "correo@ejemplo.com", "password": "1234" }
```
Si las credenciales son correctas, guarda el JWT en una cookie HttpOnly y devuelve los datos del perfil.

### Logout
```http
POST /api/auth/logout
```
Elimina la cookie del navegador y cierra la sesión.

---

## Crear un nuevo módulo

```bash
nest g resource modules/libros --no-spec
```
Seleccionar: **REST API → Yes** para generar controlador, servicio, DTOs y entidad.

<br><br>
---

# Proteger rutas

**Todo el controlador** — se coloca debajo de `@Controller()`:
```typescript
@Controller('libros')
@Auth(UserRole.ADMIN, UserRole.EDITOR)
export class LibrosController { ... }
```

**Un solo endpoint:**
```typescript
@Auth(UserRole.ADMIN)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.librosService.remove(+id);
}
```

**Solo requiere sesión activa (sin restricción de rol):**
```typescript
@Auth()
@Get()
findAll() { ... }
```

> Los roles disponibles están definidos en `roles.enum.ts`.



<br><br>
---

# Ejemplo de módulo — Libros

### Tabla SQL
```sql
CREATE TABLE tlibro (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (id)
);
```

### Entidad
```typescript
@Entity('tlibro')
export class Libro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  titulo!: string;

  @Column({ length: 100 })
  autor!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado!: string;
}
```

### DTO
```typescript
export class CreateLibroDto {
  @Obligatorio('titulo')
  @Maximo(100, 'titulo')
  titulo!: string;

  @Obligatorio('autor')
  @Maximo(100, 'autor')
  autor!: string;

  @Obligatorio('precio')
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio!: number;

  @Opcional()
  estado?: 'activo' | 'inactivo';
}
```



### libros.module.ts
```typescript
imports: [TypeOrmModule.forFeature([libros])],
```





### Controlador
```typescript
@Auth(UserRole.ADMIN, UserRole.EDITOR)
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(@Query('buscar') buscar?: string) {
    return this.librosService.findAll(buscar);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.librosService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateLibroDto) {
    return this.librosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLibroDto) {
    return this.librosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.librosService.remove(+id);
  }
}
```

### Service
```typescript
@Injectable()
export class LibrosService {
 
constructor(@InjectRepository(Libro)private readonly repo: Repository<Libro>){}


  async findAll(buscar?: string) {
    // Si hay búsqueda, filtra por titulo o autor; si no, devuelve todos
    const where = buscar
      ? [{ titulo: Like(`%${buscar}%`) }, { autor: Like(`%${buscar}%`) }]
      : {};

    return await this.repo.find({
      select: ['id', 'titulo', 'autor', 'precio', 'estado'],
      where,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const libro = await this.repo.findOne({ where: { id } });
    if (!libro) throw new NotFoundException('Libro no encontrado');
    return libro;
  }

  async create(dto: CreateLibroDto) {
    const libro = this.repo.create(dto);
    await this.repo.save(libro);
    return { message: 'Libro registrado con éxito' };
  }

  async update(id: number, dto: UpdateLibroDto) {
    const libro = await this.repo.findOne({ where: { id } });
    if (!libro) throw new NotFoundException('Libro no encontrado');

    Object.assign(libro, dto);
    await this.repo.save(libro);
    return { message: 'Libro modificado con éxito' };
  }

  async remove(id: number) {
    const libro = await this.repo.findOne({ where: { id } });
    if (!libro) throw new NotFoundException('Libro no encontrado');

    try {
      await this.repo.remove(libro);
      return { message: 'Libro eliminado' };
    } catch (error: any) {
      // Error de FK: el registro está relacionado con otros y no se puede eliminar
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
        return { message: 'No se puede eliminar porque este registro está relacionado con otros registros' };
      }
      throw error;
    }
  }
}
```

### Endpoints generados

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/libros` | Listar todos (soporta `?buscar=`) |
| `GET` | `/api/libros/:id` | Obtener uno por ID |
| `POST` | `/api/libros` | Crear |
| `PATCH` | `/api/libros/:id` | Actualizar |
| `DELETE` | `/api/libros/:id` | Eliminar |

---
