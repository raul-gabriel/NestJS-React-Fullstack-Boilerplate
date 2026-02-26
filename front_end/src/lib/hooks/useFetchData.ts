import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchData,
  fetchDataById,
  createData,
  updateData,
  deleteData,
  updateDataManual,
} from '@/lib/api/consultasApiToken';
import type { ApiResponse } from '@/utils/types/types_general';

interface MutationOptions<TData = ApiResponse> {
  onSuccess?: (data: TData) => void;
  onError?: (error: { message: string; status: number }) => void;
}

export const useFetchData = <T>(url: string, buscar = '', query?: string) =>
  useQuery<T, Error>({
    queryKey: [url, buscar, query],
    queryFn: () => fetchData<T>(url, buscar, query),
  });

export const useFetchDataById = <T>(url: string, id: number) =>
  useQuery<T, Error>({
    queryKey: [url, id],
    queryFn: () => fetchDataById<T>(url, id),
    enabled: id > 0,
  });

export const useCreateData = <TBody = unknown>(url: string, options?: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TBody) => createData(url, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [url] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => options?.onError?.({ message: error?.message, status: error?.status }),
  });
};

export const useUpdateData = <TBody = unknown>(url: string, id: number, options?: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TBody) => updateData(url, data, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [url, id] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => options?.onError?.({ message: error?.message, status: error?.status }),
  });
};

export const useDeleteData = (url: string, options?: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(url, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [url] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => options?.onError?.({ message: error?.message, status: error?.status }),
  });
};

export const useUpdateDataManual = <TBody = unknown>(url: string, options?: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TBody }) => updateDataManual(url, id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [url, variables.id] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => options?.onError?.({ message: error?.message, status: error?.status }),
  });
};