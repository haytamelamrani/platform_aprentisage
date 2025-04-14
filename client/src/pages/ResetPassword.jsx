import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ForgetPassword.css';
import aiImage from '../assets/AI.png';

const ResetPassword = ({ darkMode }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    toast.info('🔐 Réinitialisation en cours...');

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Mot de passe mis à jour avec succès !');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || '❌ Lien invalide ou expiré.');
      }
    } catch (err) {
      toast.error('❌ Erreur serveur.');
    }
  };

  return (
    <div className={`forget-password-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="forget-password-container">
        <form className="forget-password-form" onSubmit={handleReset}>
          <h2>Réinitialiser le mot de passe</h2>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Réinitialiser</button>
        </form>

        <div className="ai-image-box">
          <img src={aiImage} alt="Assistant IA" />
          <p className="ai-message">Tu es à deux doigts de reprendre le contrôle 🔐</p>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ResetPassword;
