import axios, { AxiosError } from 'axios';
import { url_servidor } from '@/config/datos';
import type { ErrorRespuesta, LoginResponse } from '@/utils/types/typesLogin';

const backendBaseUrl = url_servidor;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const { status, data } = await axios.post(`${backendBaseUrl}/auth/login`, { username: email, password }, { withCredentials: true });

    if (status !== 201) {
      return { estado: false, message: (data as ErrorRespuesta).message || 'Error desconocido al iniciar sesión' };
    }

    // guardamos los datos del usuario
    return data.user
      ? { estado: true, message: 'Inicio de sesión exitoso', perfil: data.user }
      : { estado: false, message: 'Error al obtener perfil de usuario' };

  } catch (error) {
    const { response } = error as AxiosError<ErrorRespuesta>;
    console.log(response)
    return { estado: false, message: response?.data?.message || 'Error de red al iniciar sesión  xxxx' };
  }
};


export async function borrarToken() {
  await axios.post(`${backendBaseUrl}/auth/logout`, {}, { withCredentials: true });
}


