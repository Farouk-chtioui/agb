// PublicRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  return token && location.pathname === '/' ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;