import { useState, useRef, type ReactNode, type RefObject } from 'react';
import DotsVerticalIcon from '../globales/DotsVerticalIcon';
import useClickOutsideTabla from '../hooks/useClickOutsideTabla';

interface TablaProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  renderRowActions?: (item: T) => ReactNode;
  itemsPerPage?: number; // Nuevo parámetro opcional para definir elementos por página (NUMERO DE PAGINACION)
  OcultarIndice?: boolean;
}

const DataTable = <T,>({ headers, data, renderRow, renderRowActions, itemsPerPage = 5, OcultarIndice }: TablaProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Calcular los elementos a mostrar en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // Funciones para cambiar de página
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full overflow-x-auto md:overflow-visible">
      <table className="w-full table-auto mt-2 mb-2 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-sm font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
            {renderRowActions && (
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {paginatedData.map((item, index) => (
            <TablaRow
              key={index}
              item={item}
              renderRow={renderRow}
              renderRowActions={renderRowActions}
            />
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {!OcultarIndice && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
          >
            Anterior
          </button>

          <span className="text-gray-700 text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );


};





interface TablaRowProps<T> {
  item: T;
  renderRow: (item: T) => ReactNode;
  renderRowActions?: (item: T) => ReactNode;
}

const TablaRow = <T,>({ item, renderRow, renderRowActions }: TablaRowProps<T>) => {
  const [menuOpen, setMenuOpen] = useState(false);
 const menuRef = useRef<HTMLElement>(null);

  useClickOutsideTabla(menuRef, () => setMenuOpen(false));

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-200 transition">
      {renderRow(item)}

      {renderRowActions && (
        <td className="py-3 px-4 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex justify-center items-center rounded-md border border-gray-300 px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none transition"
          >
            <DotsVerticalIcon className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div
               ref={menuRef as RefObject<HTMLDivElement>}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-200 z-10"
            >
              {renderRowActions(item)}
            </div>
          )}
        </td>
      )}
    </tr>
  );
};

export default DataTable;
