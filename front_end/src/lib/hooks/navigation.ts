import type { NavigateFunction } from 'react-router-dom';

let navigateGlobal: NavigateFunction | null = null;

export const setNavigate = (navigate: NavigateFunction) => {
  navigateGlobal = navigate;
};

export const redirigir = (ruta: string) => {
  if (navigateGlobal) {
    navigateGlobal(ruta);
  } else {
    console.error('No se ha configurado el navigate global');
  }
};
