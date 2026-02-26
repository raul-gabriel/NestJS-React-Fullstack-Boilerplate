import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Rutas from '@/routes/Rutas'

import '@/assets/css/style.css';
import '@/assets/css/mis_estilos.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom';



//para que cuando halla error react query no haga reintentos infinitos, solo 2 veces y si es error de cliente (400-499) no hace reintentos
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Rutas />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);


/**
  npm install react-router-dom


  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p  

  npm i lucide-react
  npm install react-query axios zustand sweetalert2 @headlessui/react
  npm install use-debounce
  npm install react-hook-form zod @hookform/resolvers


  npm install flyonui
 */