import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/QcmPage.css';

const QcmPage = ({ darkMode }) => {
  const { idcour } = useParams();
  const [qcms, setQcms] = useState([]);
  const [nomCours, setNomCours] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (!idcour) return;

    axios.get(`http://localhost:5000/api/qcm/${idcour}`)
      .then(async (res) => {
        const data = res.data.qcms || res.data;

        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }

        const qcmsWithShuffled = data.map((qcm) => {
          const allAnswers = [...qcm.wrongAnswers, qcm.correctAnswer];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          return { ...qcm, shuffledAnswers };
        });

        setQcms(qcmsWithShuffled);

        const courseId = data[0]?.course;
        if (courseId) {
          try {
            const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
            setNomCours(courseRes.data.titre || 'Cours inconnu');
          } catch (err) {
            console.warn("❌ Erreur récupération nom du cours :", err);
            setNomCours('Cours inconnu');
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Erreur chargement QCM :', err);
        setLoading(false);
      });
  }, [idcour]);

  const handleAnswerSelect = (qcmId, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [qcmId]: answer });
  };

  const handleSubmit = () => {
    let correct = 0;
    qcms.forEach((qcm) => {
      if (selectedAnswers[qcm._id] === qcm.correctAnswer) correct++;
    });

    setScore(correct);

    const email = localStorage.getItem('email');
    const total = qcms.length;
    const pourcentage = ((correct / total) * 100).toFixed(2);

    const dataToSend = {
      email,
      nomCours,
      score: correct,
      total,
      pourcentage
    };

    if (!email || !nomCours || total === 0) {
      setNotification("❌ Données manquantes. Progression non enregistrée.");
      return;
    }

    console.log("📤 Données envoyées au backend :", dataToSend);

    axios.post('http://localhost:5000/api/progress/save', dataToSend)
      .then(() => {
        setNotification("✅ Progression enregistrée !");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message;
        console.error("❌ Erreur enregistrement progression :", errorMessage);
        setNotification(
          <>
            <p>❌ <strong>Erreur lors de l'enregistrement :</strong> {errorMessage}</p>
            <pre style={{
              fontSize: '0.8rem',
              marginTop: '10px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '10px',
              borderRadius: '8px'
            }}>
{JSON.stringify(dataToSend, null, 2)}
            </pre>
          </>
        );
      });
  };

  const getAnswerClass = (qcm, ans) => {
    if (score === null) return '';
    const selected = selectedAnswers[qcm._id];
    if (ans === qcm.correctAnswer) return 'correct-answer';
    if (ans === selected && selected !== qcm.correctAnswer) return 'wrong-answer';
    return '';
  };

  return (
    <div className={`qcm-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>📝 QCM du cours : <span style={{ color: '#4ade80' }}>{nomCours}</span></h2>

      {notification && (
        <div className="notification" style={{ marginBottom: '1rem', color: 'orange' }}>
          {notification}
        </div>
      )}


      {loading && <p>⏳ Chargement...</p>}
      {!loading && qcms.length === 0 && <p>⚠️ Aucun QCM trouvé.</p>}

      {qcms.map((qcm, index) => (
        <div key={qcm._id} className="qcm-block">
          <p><strong>Q{index + 1}:</strong> {qcm.question}</p>
          {qcm.shuffledAnswers.map((ans, idx) => (
            <label key={idx} className={`answer-option ${getAnswerClass(qcm, ans)}`}>
              <input
                type="radio"
                name={qcm._id}
                value={ans}
                checked={selectedAnswers[qcm._id] === ans}
                onChange={() => handleAnswerSelect(qcm._id, ans)}
                disabled={score !== null}
              />
              {ans}
            </label>
          ))}
        </div>
      ))}

      {qcms.length > 0 && score === null && (
        <button onClick={handleSubmit} className="submit-button">Valider</button>
      )}

      {score !== null && (
        <div className="result">
          <h3>✅ Score : {score} / {qcms.length}</h3>
          <p>🎯 Pourcentage : {(score / qcms.length * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default QcmPage;
