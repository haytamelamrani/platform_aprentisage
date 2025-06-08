import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteEtudiant = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'etudiant') {
    alert('⛔ Accès refusé. Réservé aux étudiants.');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRouteEtudiant;
