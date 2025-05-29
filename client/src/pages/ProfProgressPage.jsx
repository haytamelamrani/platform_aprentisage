import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProfProgressPage.css';

const ProfProgressPage = ({ darkMode }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profName, setProfEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    setProfEmail(email);

    if (!email) return;

    const fetchData = async () => {
      try {
        const coursesRes = await axios.get('http://localhost:5000/api/courses/all');
        const myCourses = coursesRes.data
          .filter(c => c.emailProf === email)
          .map(c => c.titre.trim());

        const progressRes = await axios.get('http://localhost:5000/api/progress');
        const allProgress = progressRes.data;

        const filteredResults = [];

        for (const entry of allProgress) {
          const email = entry._id;
          let studentName = '(Nom inconnu)';

          // 🔍 Appel pour récupérer le nom de l’étudiant
          try {
            const userRes = await axios.get(`http://localhost:5000/api/auth/${email}`);
            studentName = userRes.data.nom || studentName;
          } catch (err) {
            console.warn(`Nom introuvable pour ${email}`);
          }

          entry.scores.forEach((score) => {
            if (myCourses.includes(score.nomCours.trim())) {
              filteredResults.push({
                nomCours: score.nomCours,
                email,
                studentName,
                note: `${score.score} / ${score.total}`,
                pourcentage: score.pourcentage,
                date: new Date(score.date).toLocaleDateString(),
              });
            }
          });
        }

        setResults(filteredResults);
      } catch (error) {
        console.error('Erreur de récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`prof-progress-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Résultats des étudiants</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : results.length === 0 ? (
        <p>Aucun résultat trouvé pour vos cours.</p>
      ) : (
        <div className="results-grid">
          {results.map((res, i) => (
            <div key={i} className="result-card">
              <h2>{res.nomCours}</h2>
              <p><strong>Nom :</strong> {res.studentName}</p>
              <p><strong>Email :</strong> {res.email}</p>
              <p><strong>Note :</strong> {res.note}</p>
              <p><strong>Pourcentage :</strong> {res.pourcentage}%</p>
              <p><strong>Date :</strong> {res.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfProgressPage;
