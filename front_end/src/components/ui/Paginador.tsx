// src/components/ui/Paginador.tsx
interface Props {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Paginador: React.FC<Props> = ({ page, lastPage, total, onPageChange }) => {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  // Muestra máx 5 páginas centradas en la actual
  const visible = pages.filter(
    (p) => p === 1 || p === lastPage || Math.abs(p - page) <= 2
  );

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <span>Total: {total} registros</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        {visible.map((p, i) => {
          const prev = visible[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1">…</span>}
              <button
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded font-medium transition ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === lastPage}
          className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Paginador;
