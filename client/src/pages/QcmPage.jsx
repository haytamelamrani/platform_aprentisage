import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/QcmPage.css';

const QcmPage = ({ darkMode }) => {
  const { idcour } = useParams();
  const [qcms, setQcms] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idcour) return;

    axios.get(`http://localhost:5000/api/qcm/${idcour}`)
      .then((res) => {
        const data = res.data.qcms || res.data;
        const qcmsWithShuffled = data.map((qcm) => {
          const allAnswers = [...qcm.wrongAnswers, qcm.correctAnswer];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          return { ...qcm, shuffledAnswers };
        });

        setQcms(qcmsWithShuffled);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement QCM :', err);
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
  };

  return (
    <div className={`qcm-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>📝 QCM du cours</h2>
      {loading && <p>⏳ Chargement...</p>}
      {!loading && qcms.length === 0 && <p>⚠️ Aucun QCM trouvé.</p>}

      {qcms.map((qcm, index) => (
        <div key={qcm._id} className="qcm-block">
          <p><strong>Q{index + 1}:</strong> {qcm.question}</p>
          {qcm.shuffledAnswers.map((ans, idx) => (
            <label key={idx} className="answer-option">
              <input
                type="radio"
                name={qcm._id}
                value={ans}
                checked={selectedAnswers[qcm._id] === ans}
                onChange={() => handleAnswerSelect(qcm._id, ans)}
              />
              {ans}
            </label>
          ))}
        </div>
      ))}

      {qcms.length > 0 && (
        <button onClick={handleSubmit} className="submit-button">Valider</button>
      )}

      {score !== null && (
        <div className="result">
          <h3>✅ Score : {score} / {qcms.length}</h3>
        </div>
      )}
    </div>
  );
};

export default QcmPage;
