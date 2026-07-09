import { DataSesion } from "@/utils/store/DataSesion";
import { redirigir } from "@/lib/hooks/navigation";
import { Alerta, ToastFlotanteChico } from "./Toas";
import { borrarToken, login, verificarSesionApi } from "@/lib/api/api_auth";

/*
Servicio de gestión de sesión que controla login (métodos para las sesiones que llaman
a las api a través de api_auth.ts)
Estos métodos son llamados desde componentes.
*/

// inicia sesión: llama a la api, guarda el user en el store y redirige al panel
export const IniciarSesion = async (email: string, password: string): Promise<{ estado: boolean; message: string }> => {
    const { estado, message, perfil } = await login(email, password);

    if (estado) {
        DataSesion.getState().setUser(perfil ?? null);
        redirigir('/panel');
    }

    return { estado, message };
};

// borra cookie en backend y limpia el store, sin redirigir (uso interno)
async function limpiarSesion() {
    await borrarToken();
    DataSesion.getState().LimpiarData();
}

// cierra sesión por acción explícita del usuario (ej. botón "Cerrar sesión") -> limpia y redirige
export async function cerrarSesion() {
    await limpiarSesion();
    redirigir('/login');
}

// muestra alerta de solicitud no autorizada y cierra sesión (ej. interceptor de axios ante 401)
export function expulsarInautorizacion(mensaje: string) {
    Alerta('error', mensaje, '¡Uff! Hubo una solicitud no autorizada');
    cerrarSesion();
}

// consulta al backend si la cookie es válida y sincroniza el store; se llama 1 vez por pestaña
export async function hidratarSesion() {
    if (DataSesion.getState().verificado) return;

    try {
        const resultado = await verificarSesionApi();
        if (resultado.estado && resultado.perfil) {
            DataSesion.getState().setUser(resultado.perfil);
        } else {
            await limpiarSesion(); // sesión inválida -> limpia cookie + store, sin redirigir (lo hace ProtectedRoute)
        }
    } finally {
        DataSesion.getState().setVerificado(true);
    }
}

// lee el store (sin red) y redirige a /panel si ya hay sesión -> se usa en la página de Login
export function verificarSesion() {
    const user = DataSesion.getState().user;
    if (user) {
        ToastFlotanteChico("info", 'Ya has iniciado sesión. No puedes volver a iniciar sesión.');
        redirigir('/panel');
    }
}