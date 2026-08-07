import { useState, useRef, useLayoutEffect, type RefObject, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Paginador from './Paginador';
import DotsVerticalIcon from '../globales/DotsVerticalIcon';
import useClickOutsideTabla from '../hooks/useClickOutsideTabla';

interface Props<T> {
  headers: string[];
  data: T[];
  keyField: keyof T;
  renderRow: (item: T) => ReactNode;
  renderRowActions?: (item: T) => ReactNode;
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

function TableRow<T>({
  item, renderRow, renderRowActions,
}: {
  item: T;
  renderRow: (item: T) => ReactNode;
  renderRowActions?: (item: T) => ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  useClickOutsideTabla(menuRef, () => setMenuOpen(false));

  useLayoutEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 160, // 160px = w-40
      });
    }
  }, [menuOpen]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100 transition">
      {renderRow(item)}
      {renderRowActions && (
        <td className="py-3 px-4 relative">
          <button
            ref={buttonRef}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex justify-center items-center rounded-md border border-gray-300 px-2 py-2 bg-white text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <DotsVerticalIcon className="w-5 h-5" />
          </button>
          {menuOpen && createPortal(
            <div
              ref={menuRef as RefObject<HTMLDivElement>}
              style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
              className="w-40 rounded-md shadow-lg bg-white ring-1 ring-gray-200 z-50"
            >
              {renderRowActions(item)}
            </div>,
            document.body
          )}
        </td>
      )}
    </tr>
  );
}

function DataTablePaginado<T>({
  headers, data, keyField,
  renderRow, renderRowActions,
  page, lastPage, total, onPageChange,
}: Props<T>) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto mt-2 mb-2 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-sm font-semibold text-gray-700">{h}</th>
              ))}
              {renderRowActions && (
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length + (renderRowActions ? 1 : 0)}
                  className="text-center py-8 text-gray-400"
                >
                  No se encontraron registros
                </td>
              </tr>
            ) : data.map((item) => (
              <TableRow
                key={String(item[keyField])}
                item={item}
                renderRow={renderRow}
                renderRowActions={renderRowActions}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Paginador
        page={page}
        lastPage={lastPage}
        total={total}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default DataTablePaginado;
