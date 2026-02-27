# Frontend — React + Vite

SPA construida con React 19, TypeScript y Tailwind v4. Consume la API REST del backend mediante Axios con autenticación JWT en cookies HttpOnly.

---

## librerias
si vas montar en un proyecto en blanco

```bash
npm install react-router-dom axios zustand sweetalert2 use-debounce
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
```

## Estructura relevante

| Archivo / Carpeta | Descripción |
|---|---|
| `src/config/datos.ts` | URLs del servidor, API de terceros y configuración global |
| `src/Layouts/` | Layout del dashboard: header, footer, menús y estructura base |
| `src/pages/` | Páginas de la aplicación |
| `src/routes/Rutas.tsx` | Configuración central de rutas, loader inicial y estructura del panel |
| `src/routes/ProtectedRoute.tsx` | Protege rutas que requieren sesión activa |

### Carpeta `lib`

| Archivo | Descripción |
|---|---|
| `src/lib/api/api_auth.ts` | Métodos de autenticación (login, logout) contra la API REST |
| `src/lib/api/consultasApiToken.ts` | Cliente Axios centralizado con interceptores; maneja errores 401 globalmente |
| `src/lib/hooks/useFetchData.ts` | Hooks con React Query que encapsulan CRUD, gestionan caché e invalidan consultas tras mutaciones |

### Carpeta `utils`

| Archivo | Descripción |
|---|---|
| `utils/classes/sesiones.ts` | Gestión de sesión: llama a `api_auth.ts` y es invocado desde los componentes |
| `utils/classes/Toas.ts` | Toasts y alertas con SweetAlert2 (éxito, error, confirmación) |
| `utils/schemas/validacion.ts` | Esquemas Zod para validar formularios del CRUD |
| `utils/store/DataSesion.ts` | Store global con Zustand para almacenar datos de sesión |
| `utils/types/types_general.ts` | Types TypeScript compartidos entre componentes y tablas CRUD |

---


<br>
<br>
<br>

# Ejemplo


## Crear una nueva página CRUD

### 1. Type — `utils/types/types_general.ts`
```typescript
export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  estado: 'activo' | 'inactivo';
}
```

### 2. Validación — `utils/schemas/validacion.ts`
```typescript
export const LibroSchema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio'),
  autor: z.string().min(1, 'El autor es obligatorio'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  estado: z.enum(['activo', 'inactivo']),
});

export type LibroForm = z.infer<typeof LibroSchema>;
```

### 3. Página — `pages/Libros/Libros.tsx`
```tsx
const Libros: React.FC = () => {
  const [buscar, setBuscar] = useState('');
  const [debouncedBuscar] = useDebounce(buscar, 1000);
  const [estadoModal, setEstadoModal] = useState(false);
  const [dataModificar, setDataModificar] = useState<LibroForm | null>(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error, refetch } =
    useFetchData<Libro[]>('/libros', debouncedBuscar);

  const handleSuccess = (data: ApiResponse) => {
    ToastFlotanteMediano(data.status, data.message);
    setLoading(false);
    refetch();
  };

  const handleError = (error: { message: string; status: number }) => {
    ToastFlotanteMediano(error.status, error.message);
    setLoading(false);
  };

  const registrar = useCreateData('/libros', {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const modificar = useUpdateDataManual('/libros', {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const eliminar = useDeleteData('/libros', {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleGuardar = (libro: LibroForm) => {
    setLoading(true);

    if (dataModificar) {
      modificar.mutate({ id: dataModificar.id, data: libro });
    } else {
      registrar.mutate(libro);
    }

    setEstadoModal(false);
    setDataModificar(null);
  };

  const handleDelete = async (id: number) => {
    if (await AlertaConfirmacion('¿Deseas eliminar este libro?')) {
      setLoading(true);
      eliminar.mutate(id);
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar datos</div>;

  return (
    <div className="cardPage">
      {loading && <div className="spinner">Procesando...</div>}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="inputField sm:w-1/3"
        />

        <button
          onClick={() => {
            setDataModificar(null);
            setEstadoModal(true);
          }}
          className="boton"
        >
          Nuevo Registro
        </button>
      </div>

      <DataTable
        headers={['ID', 'Título', 'Autor', 'Precio', 'Estado']}
        data={data || []}
        itemsPerPage={50}
        renderRow={(libro) => (
          <>
            <td>{libro.id}</td>
            <td>{libro.titulo}</td>
            <td>{libro.autor}</td>
            <td>{libro.precio}</td>
            <td>
              <span
                className={`inline-flex rounded-full py-1 px-3 text-xs font-medium ${
                  libro.estado === 'activo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {libro.estado}
              </span>
            </td>
          </>
        )}
        renderRowActions={(libro) => (
          <>
            <button
              onClick={() => {
                setDataModificar(libro);
                setEstadoModal(true);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Editar
            </button>

            <button
              onClick={() => handleDelete(libro.id)}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
            >
              Eliminar
            </button>
          </>
        )}
      />

      {estadoModal && (
        <FormularioLibros
          isOpen={estadoModal}
          cerrarModal={() => setEstadoModal(false)}
          dataModificar={dataModificar || undefined}
          onSave={handleGuardar}
        />
      )}
    </div>
  );
};

export default Libros;
```

### 4. Formulario — `pages/Libros/FormularioLibros.tsx`
```tsx
interface LibroModalProps {
  isOpen: boolean;
  cerrarModal: () => void;
  dataModificar?: Partial<LibroForm>;
  onSave: (data: LibroForm) => void;
}

const FormularioLibros: React.FC<LibroModalProps> = ({
  isOpen,
  cerrarModal,
  dataModificar,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LibroForm>({
    resolver: zodResolver(LibroSchema),
    defaultValues: { estado: 'activo' },
  });

  // Carga datos si es edición
  useEffect(() => {
    if (dataModificar) {
      reset({
        titulo: dataModificar.titulo ?? '',
        autor: dataModificar.autor ?? '',
        precio: dataModificar.precio ?? 0,
        estado: dataModificar.estado ?? 'activo',
      });
    } else {
      reset({ estado: 'activo' });
    }
  }, [dataModificar, reset]);

  const onSubmit = (data: LibroForm) => {
    onSave(data);
    cerrarModal();
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2 className="text-lg font-semibold mb-4">
          {dataModificar ? 'Editar Libro' : 'Nuevo Libro'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            name="titulo"
            type="text"
            register={register('titulo')}
            error={errors.titulo}
          />

          <InputField
            name="autor"
            type="text"
            register={register('autor')}
            error={errors.autor}
          />

          <InputField
            name="precio"
            type="number"
            register={register('precio', { valueAsNumber: true })}
            error={errors.precio}
          />

          <SelectField
            label="Estado"
            name="estado"
            register={register('estado')}
            error={errors.estado}
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {dataModificar ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioLibros;
```

### 5. Ruta — `src/routes/Rutas.tsx`
regstra la ruta.
```tsx
import Libros from '@/pages/Libros/Libros';

  <Route path="libros" element={<Libros />} />
```

### 6. menu — `/src/Layouts/Sidebar.tsx`
agrega el menu
regstra la ruta.
```tsx
 {
    id: 'libros',
    label: 'Libros',
    icon: BooksIcon,
    href: '/panel/libros',
    show: false,
  },
```