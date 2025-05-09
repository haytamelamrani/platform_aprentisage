import React, { useState } from 'react';
import '../styles/OtpVerificationPage.css';
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> gestion_email

const OtpVerificationPage = ({ darkMode }) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> gestion_email

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('🔄 Vérification en cours...');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
<<<<<<< HEAD
      if (res.ok) {
        setMessage('✅ Code vérifié, accès autorisé.');
        // redirection possible ici
      } else {
        setMessage(data.message || '❌ Code invalide.');
=======

      if (res.ok) {
        setMessage('✅ Code vérifié, accès autorisé.');
        navigate('/login'); // redirection après succès
      } else {
        setMessage(data.message || '❌ Code invalide.');

        // 🔁 Si on reçoit une erreur liée à 3 tentatives, redirection automatique
        if (data.message && data.message.includes('Trop de tentatives')) {
          setTimeout(() => {
            navigate('/register'); // redirection vers inscription
          }, 3000); // délai pour laisser lire le message
        }
>>>>>>> gestion_email
      }
    } catch (err) {
      setMessage('❌ Erreur serveur.');
    }
  };

  return (
    <div className={`otp-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="otp-container">
        <h2>Vérification de votre compte</h2>
        <p>Un code a été envoyé à votre email. Entrez-le ci-dessous :</p>

        <form onSubmit={handleSubmit} className="otp-form">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Entrez votre code OTP"
            maxLength="6"
            required
          />
          <button type="submit">Vérifier</button>
          <p className="otp-message">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
