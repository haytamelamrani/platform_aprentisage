import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterPage.css';
import studentIcon from '../assets/student.png';
import teacherIcon from '../assets/teacher.png';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = ({ darkMode, toggleMode }) => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    dateNaissance: '',
    niveauEtude: '',
    niveauProg: '',
    anneeExp: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'professeur' && formData.anneeExp < 5) {
      alert("L'expérience minimale requise est de 5 ans.");
      return;
    }

    const dateInscription = new Date().toISOString().split('T')[0];

    const dataToSend = {
      nom: formData.nom,
      email: formData.email,
      motdepasse: formData.password,
      role,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', dataToSend);
      alert("✅ Inscription réussie !");
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erreur d'inscription";
      alert("❌ " + errorMsg);
    }
  };

  return (
    <div className={`register-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="register-container">
        <h2>Créer un compte</h2>

        <div className="role-selection">
          <div
            className={`role-card ${role === 'etudiant' ? 'selected' : ''}`}
            onClick={() => setRole('etudiant')}
          >
            <img src={studentIcon} alt="Étudiant" />
            <p>Étudiant</p>
          </div>
          <div
            className={`role-card ${role === 'professeur' ? 'selected' : ''}`}
            onClick={() => setRole('professeur')}
          >
            <img src={teacherIcon} alt="Professeur" />
            <p>Professeur</p>
          </div>
        </div>

        {role && (
          <form className="register-form" onSubmit={handleSubmit}>
            <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
            <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />

            {role === 'etudiant' && (
              <>
                <input type="date" name="dateNaissance" onChange={handleChange} required />
                <select name="niveauEtude" onChange={handleChange} required>
                  <option value="">Niveau d'étude</option>
                  <option value="L1">Licence 1</option>
                  <option value="L2">Licence 2</option>
                  <option value="L3">Licence 3</option>
                  <option value="M1">Master 1</option>
                  <option value="M2">Master 2</option>
                </select>
                <select name="niveauProg" onChange={handleChange}>
                  <option value="">Niveau en programmation</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </>
            )}

            {role === 'professeur' && (
              <input
                type="number"
                name="anneeExp"
                placeholder="Années d'expérience"
                min="5"
                onChange={handleChange}
                required
              />
            )}

           
           <button type="submit">S'inscrire</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
