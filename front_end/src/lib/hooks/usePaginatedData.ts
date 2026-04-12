// src/lib/hooks/usePaginatedData.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchData } from '@/lib/api/consultasApiToken'; // ← usa fetchData existente

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

interface UsePaginatedDataOptions {
  limit?: number;
}

export function usePaginatedData<T>(
  endpoint: string,
  buscar: string = '',
  { limit = 10 }: UsePaginatedDataOptions = {},
) {
  const [page, setPage]           = useState(1);
  const [result, setResult]       = useState<PaginatedResponse<T>>({
    data: [], total: 0, page: 1, lastPage: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Construye el query string y usa fetchData con el 3er param (query)
      const query = [`page=${page}`, `limit=${limit}`, buscar ? `buscar=${buscar}` : '']
        .filter(Boolean)
        .join('&');

      const res = await fetchData<PaginatedResponse<T>>(endpoint, '', query);
      setResult(res);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, page, limit, buscar]);

  useEffect(() => { setPage(1); }, [buscar]);
  useEffect(() => { fetch(); }, [fetch]);

  return {
    data:     result.data,
    total:    result.total,
    page:     result.page,
    lastPage: result.lastPage,
    isLoading,
    error,
    refetch:  fetch,
    setPage,
  };
}
