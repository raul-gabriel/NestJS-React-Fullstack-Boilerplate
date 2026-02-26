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
  autor:  z.string().min(1, 'El autor es obligatorio'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  estado: z.enum(['activo', 'inactivo']),
});

export type LibroForm = z.infer;
```

### 3. Página — `pages/Libros/Libros.tsx`
```tsx
const Libros: React.FC = () => {
  const [buscar, setBuscar] = useState('');
  const [debouncedBuscar] = useDebounce(buscar, 1000);
  const [estadoModal, setEstadoModal] = useState(false);
  const [dataModificar, setDataModificar] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error, refetch } = useFetchData('/libros', debouncedBuscar);

  const handleSuccess = (data: ApiResponse) => {
    ToastFlotanteMediano(data.status, data.message);
    setLoading(false);
    refetch();
  };
  const handleError = (error: { message: string; status: number }) => {
    ToastFlotanteMediano(error.status, error.message);
    setLoading(false);
  };

  const registrar = useCreateData('/libros',       { onSuccess: handleSuccess, onError: handleError });
  const modificar = useUpdateDataManual('/libros',  { onSuccess: handleSuccess, onError: handleError });
  const eliminar  = useDeleteData('/libros',        { onSuccess: handleSuccess, onError: handleError });

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

  if (isLoading) return ;
  if (error) return ;

  return (
    <>
      {loading && }
      Gestión de Libros
      
        
          <input
            type="text"
            placeholder="Buscar..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="inputField sm:w-1/3"
          />
          <button onClick={() => { setDataModificar(null); setEstadoModal(true); }} className="boton">
            Nuevo Registro
          
        

        <DataTable
          headers={['ID', 'Título', 'Autor', 'Precio', 'Estado']}
          data={data || []}
          itemsPerPage={50}
          renderRow={(libro) => (
            <>
              {libro.id}
              {libro.titulo}
              {libro.autor}
              {libro.precio}
              
                <span className={`inline-flex rounded-full py-1 px-3 text-xs font-medium ${
                  libro.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {libro.estado}
                
              
            </>
          )}
          renderRowActions={(libro) => (
            
              <button
                onClick={() => { setDataModificar(libro); setEstadoModal(true); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Editar
              
              <button
                onClick={() => handleDelete(libro.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
              >
                Eliminar
              
            
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
    </>
  );
};
```

### 4. Formulario — `pages/Libros/FormularioLibros.tsx`
```tsx
interface LibroModalProps {
  isOpen: boolean;
  cerrarModal: () => void;
  dataModificar?: Partial;
  onSave: (data: LibroForm) => void;
}

const FormularioLibros: React.FC = ({ isOpen, cerrarModal, dataModificar, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(LibroSchema),
    defaultValues: { estado: 'activo' },
  });

  // Carga los datos al editar; limpia el formulario al crear
  useEffect(() => {
    if (dataModificar) {
      reset({
        titulo:  dataModificar.titulo  ?? '',
        autor:   dataModificar.autor   ?? '',
        precio:  dataModificar.precio  ?? 0,
        estado:  dataModificar.estado  ?? 'activo',
      });
    } else {
      reset({ estado: 'activo' });
    }
  }, [dataModificar, reset]);

  const onSubmit = (data: LibroForm) => { onSave(data); cerrarModal(); };

  return (
    
      
        
          
            <InputField name="titulo" type="text" register={register('titulo')} error={errors.titulo} />
          
          
            <InputField name="autor" type="text" register={register('autor')} error={errors.autor} />
          
        
        
          
            <InputField name="precio" type="number" register={register('precio', { valueAsNumber: true })} error={errors.precio} />
          
          
            <SelectField
              label="Estado"
              name="estado"
              register={register('estado')}
              error={errors.estado}
              options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]}
            />
          
        
        
          Cancelar
          {dataModificar ? 'Actualizar' : 'Guardar'}
        
      
    
  );
};
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