import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProgressPage.css';

const ProgressPage = ({ darkMode }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    setUserEmail(email);

    if (!email) return;

    axios.get(`http://localhost:5000/api/progress/${email}`)
      .then((res) => {
        setProgress(res.data.scores || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de récupération du progrès :", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`progress-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Mon historique de QCM</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : progress.length === 0 ? (
        <p>Aucun QCM passé.</p>
      ) : (
        <div className="qcm-grid">
          {progress.map((qcm, index) => (
            <div key={index} className="qcm-card">
              <h2>{qcm.nomCours}</h2>
              <p><strong>Score :</strong> {qcm.score} / {qcm.total}</p>
              <p><strong>Pourcentage :</strong> {qcm.pourcentage}%</p>
              <p><strong>Date :</strong> {new Date(qcm.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
