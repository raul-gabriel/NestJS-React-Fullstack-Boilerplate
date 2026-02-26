import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useFetchData, useCreateData, useDeleteData, useUpdateDataManual } from '../../lib/hooks/useFetchData';
import Preloader from '../../components/globales/Preloader';
import { AlertaConfirmacion, ToastFlotanteMediano } from '../../utils/classes/Toas';
import DataTable from '../../components/ui/DataTable';
import FormularioUsuarios from './FormularioUsuarios';
import type { Usuario } from '@/utils/types/Mi_types';
import type { UsuarioForm } from '@/utils/schemas/validacion';
import type { ApiResponse } from '@/utils/types/types_general';
import { ErrorMessage } from '@/components/globales/ErrorMessage';


const Usuarios: React.FC = () => {
  const [buscar, setBuscar] = useState('');
  const [debouncedBuscar] = useDebounce(buscar, 1000);
  const [estadoModal, setEstadoModal] = useState(false);
  const [dataModificar, setDataModificar] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error, refetch } = useFetchData<Usuario[]>('/usuarios', debouncedBuscar);

  const handleSuccess = (data: ApiResponse) => {
    ToastFlotanteMediano(data.status, data.message);
    setLoading(false);
    refetch();
  };

  const handleError = (error: { message: string; status: number }) => {
    ToastFlotanteMediano(error.status, error.message);
    setLoading(false);
  };


  //mutaciones de react query
  const registrar = useCreateData('/usuarios', { onSuccess: handleSuccess, onError: handleError });
  const modificar = useUpdateDataManual('/usuarios', { onSuccess: handleSuccess, onError: handleError });
  const eliminar = useDeleteData('/usuarios', { onSuccess: handleSuccess, onError: handleError });


  const handleGuardarModificar = (usuario: UsuarioForm) => {
    setLoading(true);
    if (dataModificar) {
      modificar.mutate({ id: dataModificar.id, data: usuario });
    } else {
      registrar.mutate(usuario);
    }
    setEstadoModal(false);
    setDataModificar(null);
  };

  const handleDelete = async (id: number) => {
    if (await AlertaConfirmacion('¿Deseas eliminar este usuario?')) {
      setLoading(true);
      eliminar.mutate(id);
    }
  };

  if (isLoading) return <Preloader />;
  if (error) return <ErrorMessage message={error.message} />;


  return (
    <>
      {loading && <Preloader />}
      <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
        Gestión de Usuarios
      </h1>

      <div className="cardPage">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="inputField sm:w-3/4 lg:w-1/2 xl:w-1/3"
          />
          <button
            onClick={() => { setDataModificar(null); setEstadoModal(true); }}
            className="boton sm:w-auto w-full mt-4 sm:mt-0"
          >
            Nuevo Registro
          </button>
        </div>

        <DataTable
          headers={['ID', 'Nombres', 'Email', 'Teléfono', 'Rol', 'Estado']}
          data={data || []}
          itemsPerPage={50}
          renderRow={(usuario) => (
            <>
              <td className="filaTabla">{usuario.id}</td>
              <td className="filaTabla">{usuario.nombres}</td>
              <td className="filaTabla">{usuario.email}</td>
              <td className="filaTabla">{usuario.telefono}</td>
              <td className="filaTabla">{usuario.tipo_usuario}</td>
              <td className="filaTabla">
                <span
                  className={`inline-flex rounded-full py-1 px-3 text-xs font-medium ${usuario.estado === 'activo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}
                >
                  {usuario.estado}
                </span>
              </td>
            </>
          )}
          renderRowActions={(usuario) => (
            <div className="py-1">
              {usuario.id !== 1 ? (
                <>
                  <button
                    onClick={() => {
                      setDataModificar(usuario);
                      setEstadoModal(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded">
                  Sin acciones
                </div>
              )}
            </div>
          )}
        />
      </div>

      <div className="p-4">
        {estadoModal && (
          <FormularioUsuarios
            isOpen={estadoModal}
            cerrarModal={() => setEstadoModal(false)}
            dataModificar={dataModificar || undefined}
            onSave={handleGuardarModificar}
          />
        )}
      </div>
    </>
  );
};


export default Usuarios;
