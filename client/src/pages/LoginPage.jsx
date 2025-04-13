import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';


const LoginPage = ({ darkMode, toggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    e.preventDefault();
    setMsg('Connexion en cours...');
    // Simuler le login
    setTimeout(() => {
      setMsg('✅ Connexion réussie');
    }, 1000);
    if (res.ok) {
      const data = await res.json();
      
      // Extrait le rôle de l'utilisateur
      const role = data.role;
    
      // Redirection selon le rôle
      if (role === 'etudiant') {
        navigate('/student-dashboard');
      } else if (role === 'professeur') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/user-dashboard');
      }
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
