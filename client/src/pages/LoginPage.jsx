import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ déplacer ici

    setMsg('Connexion en cours...');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        motdepasse: password, // ✅ correspond à ce que le backend attend
      });

      const { token, user } = res.data;

      // ✅ Stocker le token dans le localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.nom);
      localStorage.setItem('email', email);

      setMsg('✅ Connexion réussie');

      // ✅ Redirection selon le rôle
      if (user.role === 'etudiant') {
        navigate('/student-dashboard');
      } else if (user.role === 'professeur') {
        navigate('/Prof');
      } else {
        navigate('/admin-dashboard');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur de connexion";
      setMsg('❌ ' + errorMessage);
    }
  };

  return (
    <div className={`login-page ${darkMode ? 'dark-mode' : ''}`}>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
        <a href="/forgot-password" className="forgot-link">Mot de passe oublié ?</a>
        {msg && <p className="feedback">{msg}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
