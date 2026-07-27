import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { User } from '@/utils/types/typesLogin';

const NOMBRE_STORE = 'auth_store';

interface DataEstado {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  LimpiarData: () => void;
}

export const DataSesion = create<DataEstado>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        LimpiarData: () => {
          localStorage.removeItem(NOMBRE_STORE);
          set({ user: null });
        },
      }),
      { name: NOMBRE_STORE, storage: createJSONStorage(() => localStorage) }
    )
  )
);