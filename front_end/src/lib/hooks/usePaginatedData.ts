// src/lib/hooks/usePaginatedData.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchData } from '@/lib/api/consultasApiToken'; // ← usa fetchData existente

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

type FilterValue = string | number | boolean | undefined;

type UsePaginatedDataOptions = {
  limit?: number;
  filters?: Record<string, FilterValue>;
};

export function usePaginatedData<T>(
  endpoint: string,
  buscar: string = '',
  { limit = 10, filters = {} }: UsePaginatedDataOptions = {},
) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<T>>({
    data: [], total: 0, page: 1, lastPage: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParams = Object.entries(filters)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}=${v}`);

      const query = [
        `page=${page}`,
        `limit=${limit}`,
        buscar ? `buscar=${buscar}` : '',
        ...filterParams,
      ]
        .filter(Boolean)
        .join('&');

      const res = await fetchData<PaginatedResponse<T>>(endpoint, '', query);
      setResult(res);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, page, limit, buscar, filtersKey]);

  useEffect(() => { setPage(1); }, [buscar, filtersKey]);
  useEffect(() => { fetch(); }, [fetch]);

  return {
    data: result.data,
    total: result.total,
    page: result.page,
    lastPage: result.lastPage,
    isLoading,
    error,
    refetch: fetch,
    setPage,
  };
}


/**
 * // sin buscar, sin filtros
usePaginatedData<Ciclo>('/ciclos');

// solo buscar
usePaginatedData<Matricula>('/matriculas', debouncedBuscar);

// buscar + un filtro
usePaginatedData<Usuario>('/usuarios', debouncedBuscar, {
  filters: { unidad_id: unidadId || undefined },
});

// buscar + varios filtros
usePaginatedData<Matricula>('/matriculas', debouncedBuscar, {
  filters: { idCiclo, estadoPago },
});

// solo filtros, sin buscar
usePaginatedData<Reporte>('/reportes', '', {
  filters: { anio, mes },
});
 */