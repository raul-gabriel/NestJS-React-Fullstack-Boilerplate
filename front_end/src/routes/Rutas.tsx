import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from '@/components/globales/Loader';
import HomeDasboard from '@/pages/home/Home';
import ProtectedRoute from './ProtectedRoute';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Usuarios from '@/pages/usuarios/Usuarios';
import { setNavigate } from '@/lib/hooks/navigation';
import AdminLayout from '@/Layouts/AdminLayout';
import Perfil from '@/pages/usuarios/Perfil';


function Rutas() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>


      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<AdminLayout />}>
            <Route index element={<HomeDasboard />} />
            <Route path="home" element={<HomeDasboard />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="perfil" element={<Perfil />} />

          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Rutas;
