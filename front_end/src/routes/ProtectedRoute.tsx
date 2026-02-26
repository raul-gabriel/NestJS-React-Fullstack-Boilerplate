import { Navigate, Outlet } from 'react-router-dom';
import { DataSesion } from '@/utils/store/DataSesion';



const ProtectedRoute: React.FC = () => {
  const user = DataSesion((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
