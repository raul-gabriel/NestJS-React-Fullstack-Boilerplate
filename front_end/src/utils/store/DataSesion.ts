import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import  type { User } from '@/utils/types/typesLogin';
import { nombreCache } from '@/config/datos';


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
          sessionStorage.removeItem(nombreCache);
          set({ user: null });
        },
      }),
      { name: 'auth_store', storage: createJSONStorage(() => sessionStorage) }
    )
  )
);