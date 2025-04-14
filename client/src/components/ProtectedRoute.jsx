import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };

    checkAuth();
  }, []);

  if (isValid === null) {
    return <p>Vérification du jeton...</p>;
  }

  if (!isValid) {
    alert("⛔ Accès refusé. Veuillez vous connecter.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
