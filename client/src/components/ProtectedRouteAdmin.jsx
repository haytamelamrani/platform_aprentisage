import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'admin') {
    alert('⛔ Accès refusé. Réservé aux administrateurs.');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRouteAdmin;
