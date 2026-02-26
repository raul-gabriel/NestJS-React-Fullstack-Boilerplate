
import { DataSesion } from "@/utils/store/DataSesion";
import { redirigir } from "@/lib/hooks/navigation";
import { Alerta, ToastFlotanteChico } from "./Toas";
import { borrarToken, login } from "@/lib/api/api_auth";



export const IniciarSesion = async (email: string, password: string): Promise<{ estado: boolean; message: string }> => {
    const { estado, message, perfil } = await login(email, password);

    if (estado) {
        DataSesion.getState().setUser(perfil ?? null);
        redirigir('/panel');
    }

    return { estado, message };
};
    


export async function cerrarSesion() {
    await borrarToken();
    DataSesion.getState().LimpiarData();
    redirigir('/login');
}




export function expulsarInautorizacion(mensaje: string) {
    Alerta('error', mensaje, '¡Uff! Hubo una solicitud no autorizada')
    cerrarSesion();
}



export function verificarSesion() {
    const user = DataSesion.getState().user;
    if (user) {
        ToastFlotanteChico("info", 'Ya has iniciado sesión. No puedes volver a iniciar sesión.')
        redirigir('/panel');
    }
}


export function obtenerTokenDesdeSessionStorage() {
    const storedData = sessionStorage.getItem('auth_store');

    if (storedData) {
        const parsedData = JSON.parse(storedData);
        return parsedData?.state?.token ? parsedData.state.token : null;
    }
    return null;
}
