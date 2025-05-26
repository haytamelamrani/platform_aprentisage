import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ModifierCours.css';

const ModifierCours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({ titre: '', description: '', nomProf: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error('Erreur chargement cours:', err));
  }, [id]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/courses/${id}`, course);
      alert("Cours mis à jour !");
      navigate('/admin/cours');
    } catch (error) {
      console.error("Erreur modification cours :", error);
    }
  };

  return (
    <div className="modifier-cours-container">
      <h2>🛠️ Modifier le cours</h2>
      <form onSubmit={handleSubmit} className="modifier-cours-form">
        <label>Titre :</label>
        <input type="text" name="titre" value={course.titre} onChange={handleChange} required />

        <label>Description :</label>
        <textarea name="description" value={course.description} onChange={handleChange} rows={4} />

        <label>Nom du professeur :</label>
        <input type="text" name="nomProf" value={course.nomProf} onChange={handleChange} required />

        <button type="submit">💾 Enregistrer</button>
      </form>
    </div>
  );
};

export default ModifierCours;
