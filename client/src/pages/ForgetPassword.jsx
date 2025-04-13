import React, { useState } from 'react';
import '../styles/ForgetPassword.css';
import aiImage from '../assets/AI.png';

const ForgetPassword = ({ darkMode, toggleMode }) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('📧 Envoi en cours...');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Email de réinitialisation envoyé !');
      } else {
        setMsg(data.message || '❌ Email non reconnu.');
      }
    } catch (err) {
      setMsg('❌ Erreur serveur.');
    }
  };

  return (
    <div className={`forget-password-page ${darkMode ? 'dark-mode' : ''}`}>

      <div className="forget-password-container">
        <form className="forget-password-form" onSubmit={handleSubmit}>
          <h2>Mot de passe oublié ?</h2>
          <p>Entrez votre email pour recevoir un lien de réinitialisation.</p>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Envoyer</button>
          <p className="feedback">{msg}</p>
        </form>

        <div className="ai-image-box">
          <img src={aiImage} alt="Assistant IA" />
          <p className="ai-message">Je suis là pour t’aider à récupérer ton mot de passe 💡</p>
        </div>

      </div>
    </div>
  );
};

export default ForgetPassword;
