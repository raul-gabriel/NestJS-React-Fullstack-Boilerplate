import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DataSesion } from '@/utils/store/DataSesion';
import { hidratarSesion } from '@/utils/classes/sesiones';
import Preloader from '@/components/globales/Preloader';
import { getSesion } from '@/utils/store/SesionCookie';

const ProtectedRoute: React.FC = () => {
  const user = DataSesion((state) => state.user);
  const [hidratando, setHidratando] = useState(() => !getSesion());

  useEffect(() => {
    if (!getSesion()) {
      hidratarSesion()
        .catch(() => { })
        .finally(() => setHidratando(false));
    }
  }, []);

  if (hidratando) return <Preloader />; // espera la respuesta del backend antes de decidir

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;