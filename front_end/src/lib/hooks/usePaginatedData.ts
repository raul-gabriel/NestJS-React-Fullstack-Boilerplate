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
  filters?: Record<string, string | number | undefined>;
}


export function usePaginatedData<T>(endpoint: string, buscar: string = '', { limit = 10, filters = {} }: UsePaginatedDataOptions = {}) {
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
      const params = [
        `page=${page}`,
        `limit=${limit}`,
        buscar ? `buscar=${encodeURIComponent(buscar)}` : '',
        ...Object.entries(filters)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`),
      ].filter(Boolean).join('&');

      const res = await fetchData<PaginatedResponse<T>>(endpoint, '', params);
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