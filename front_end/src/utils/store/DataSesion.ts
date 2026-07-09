import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { User } from '@/utils/types/typesLogin';

const NOMBRE_STORE = 'auth_store'; // debe coincidir con el "name" de persist

interface DataEstado {
  user: User | null;
  verificado: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setVerificado: (v: boolean) => void;
  LimpiarData: () => void;
}

export const DataSesion = create<DataEstado>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        verificado: false,

        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        setVerificado: (v) => set({ verificado: v }),
        LimpiarData: () => {
          localStorage.removeItem(NOMBRE_STORE);
          set({ user: null, verificado: false });
        },
      }),
      { name: NOMBRE_STORE, storage: createJSONStorage(() => localStorage) }
    )
  )
);