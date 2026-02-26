export interface User {
    id: number;
    name: string;
    roles: string;
}

export interface LoginResponse {
    estado: boolean;
    message: string;
    access_token?: string;
    perfil?: any;
}

export interface ErrorRespuesta {
    message: string;
}

