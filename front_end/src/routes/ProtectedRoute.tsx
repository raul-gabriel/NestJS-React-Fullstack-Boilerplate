import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DataSesion } from '@/utils/store/DataSesion';
import { hidratarSesion } from '@/utils/classes/sesiones';
import Preloader from '@/components/globales/Preloader';

const ProtectedRoute: React.FC = () => {
  const user = DataSesion((state) => state.user);
  const verificado = DataSesion((state) => state.verificado);

  // verifica la sesión con el backend solo al entrar a una ruta privada, una vez por pestaña
  useEffect(() => {
    hidratarSesion();
  }, []);

  if (!verificado) return <Preloader />; // espera la respuesta del backend antes de decidir

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;