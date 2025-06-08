import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteProf = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'professeur') {
    alert('⛔ Accès refusé. Réservé aux professeurs.');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRouteProf;
