import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

   if (!role || !userId) {
    return <Navigate to="/" replace />;  
  }

  return <Outlet />;  
};

export default ProtectedRoute;
