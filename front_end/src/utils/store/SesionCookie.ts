const COOKIE_Sesion = 'Sesion';

export const setSesion = (v: boolean) => {
    // sin Max-Age/Expires => cookie de sesión, se borra al cerrar el navegador
    document.cookie = `${COOKIE_Sesion}=${v ? '1' : '0'}; path=/; SameSite=Lax`;
};

export const getSesion = (): boolean => {
    if (typeof document === 'undefined') return false;
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_Sesion}=([^;]*)`));
    return match ? match[1] === '1' : false;
};

export const removeSesion = () => {
    document.cookie = `${COOKIE_Sesion}=; path=/; Max-Age=0`;
};
