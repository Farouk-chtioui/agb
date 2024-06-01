import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      element={token ? element : <Navigate to="/login" replace />}
    />
  );
};

export default ProtectedRoute;
