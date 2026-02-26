import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { url_servidor } from '@/config/datos';
import { expulsarInautorizacion } from '@/utils/classes/sesiones';
import type { ApiResponse } from '@/utils/types/types_general';

const BASE_URL = url_servidor;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});



//manejar respuestas de error de la api
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'Ocurrió un error en el servidor';

      if (status === 401) {
        expulsarInautorizacion(message);
        //return Promise.reject({ message, status }); // rechaza pero sin llegar al onError del hook
        return new Promise(() => { });
      }

      return Promise.reject({ message, status });
    }
    return Promise.reject({ message: 'Error inesperado en la solicitud', status: 0 });
  }
);


const toApiResponse = <T>(response: AxiosResponse<any>): ApiResponse<T> => ({
  message: response.data?.message || 'OK',
  status: response.status,
  data: response.data,
});



//consultas apis
export const fetchData = async <T>(url: string, buscar: string = '', query?: string): Promise<T> => {
  const fullUrl = `${url}${buscar ? `?buscar=${buscar}` : ''}${query ? `${buscar ? '&' : '?'}${query}` : ''}`;
  const response = await api.get<T>(fullUrl);
  return response.data;
};

export const fetchDataById = async <T>(url: string, id: number): Promise<T> => {
  const response = await api.get<T>(`${url}/${id}`);
  return response.data;
};

export const createData = async <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
  const response = await api.post(url, data);
  return toApiResponse<T>(response);
};

export const updateData = async <T = any>(url: string, data: any, id: number): Promise<ApiResponse<T>> => {
  const response = await api.patch(`${url}/${id}`, data);
  return toApiResponse<T>(response);
};

export const deleteData = async (url: string, id: number): Promise<ApiResponse> => {
  const response = await api.delete(`${url}/${id}`);
  return toApiResponse(response);
};

export const updateDataManual = async <T = any>(url: string, id: number, data: any): Promise<ApiResponse<T>> => {
  const response = await api.patch(`${url}/${id}`, data);
  return toApiResponse<T>(response);
};




//========================= otros =================================
//post con FormData
export const postFormData = async (url: string, formData: FormData): Promise<ApiResponse> => {
  const response = await api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return toApiResponse(response);
};


export const fetchDataExternalApi = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
};


export const updateDataSinId = async <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
  const response = await api.patch(url, data);
  return toApiResponse<T>(response);
};
