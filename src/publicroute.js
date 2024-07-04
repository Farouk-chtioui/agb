import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'market':
        return '/market/dashboard';
      case 'driver':
        return '/driver/dashboard';
      case 'user':
        return '/user/dashboard';
      default:
        return '/';
    }
  };

  const redirectPath = getRedirectPath(role);

  if (token && location.pathname === '/') {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default PublicRoute;
