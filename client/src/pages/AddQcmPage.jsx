import React, { useState, useEffect } from 'react';
import '../styles/AddQcmPage.css';

function AddQCMPage({ darkMode }) {
  const [questions, setQuestions] = useState([
    { question: '', correctAnswer: '', wrongAnswers: [''] }
  ]);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  // ✅ Charger les cours depuis le backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses/all');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Erreur de chargement des cours :', error);
      }
    };

    fetchCourses();
  }, []);

  const ajouterQuestion = () => {
    setQuestions([...questions, { question: '', correctAnswer: '', wrongAnswers: [''] }]);
  };

  const supprimerQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleWrongAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...questions];
    updated[qIndex].wrongAnswers[aIndex] = value;
    setQuestions(updated);
  };

  const ajouterWrongAnswer = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].wrongAnswers.push('');
    setQuestions(updated);
  };

  const supprimerWrongAnswer = (qIndex, aIndex) => {
    const updated = [...questions];
    updated[qIndex].wrongAnswers.splice(aIndex, 1);
    setQuestions(updated);
  };

  const envoyerQCM = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert('Veuillez sélectionner un cours.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/qcm/add-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ questions, courseId: selectedCourse })
      });

      const resData = await response.json();
      if (response.ok) {
        alert(resData.message || "QCMs ajoutés !");
        setQuestions([{ question: '', correctAnswer: '', wrongAnswers: [''] }]);
        setSelectedCourse('');
      } else {
        alert("Erreur : " + resData.message);
      }
    } catch (error) {
      console.error("Erreur d’envoi :", error);
      alert("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className={`add-qcm-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Créer des Questions QCM</h2>

      {/* ✅ Sélecteur de cours */}
      <label>Associer à un cours :</label>
      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
        <option value="">-- Sélectionnez un cours --</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.titre}
          </option>
        ))}
      </select>

      <form onSubmit={envoyerQCM}>
        {questions.map((qcm, qIndex) => (
          <div key={qIndex} className="qcm-question-block">
            <h3>Question {qIndex + 1}</h3>
            <input
              type="text"
              placeholder="Énoncé de la question"
              value={qcm.question}
              onChange={(e) => handleChange(qIndex, 'question', e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Réponse correcte"
              value={qcm.correctAnswer}
              onChange={(e) => handleChange(qIndex, 'correctAnswer', e.target.value)}
              required
            />

            <h4>Réponses fausses</h4>
            {qcm.wrongAnswers.map((ans, aIndex) => (
              <div key={aIndex}>
                <input
                  type="text"
                  placeholder={`Réponse fausse ${aIndex + 1}`}
                  value={ans}
                  onChange={(e) => handleWrongAnswerChange(qIndex, aIndex, e.target.value)}
                  required
                />
                <button type="button" className="btn-delete" onClick={() => supprimerWrongAnswer(qIndex, aIndex)}>
                  Supprimer
                </button>
              </div>
            ))}
            <button type="button" onClick={() => ajouterWrongAnswer(qIndex)}>Ajouter une réponse fausse</button>
            <hr />
            <button type="button" className="btn-delete" onClick={() => supprimerQuestion(qIndex)}> Supprimer la question</button>
            <br /><br />
          </div>
        ))}
        <button type="button" onClick={ajouterQuestion}> Ajouter une autre question</button>
        <br /><br />
        <button type="submit"> Envoyer toutes les questions</button>
      </form>
    </div>
  );
}

export default AddQCMPage;
