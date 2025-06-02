import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ darkMode }) => {
  const userName = localStorage.getItem('userName');

  const [etudiantsCount, setEtudiantsCount] = useState(0);
  const [professeursCount, setProfesseursCount] = useState(0);
  const [coursCount, setCoursCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0); // à connecter si tu as un système de messages

  useEffect(() => {
    // 🔹 Récupérer les utilisateurs
    axios.get('http://localhost:5000/api/admin/users')
      .then(res => {
        const users = res.data;
        setEtudiantsCount(users.filter(u => u.role === 'etudiant').length);
        setProfesseursCount(users.filter(u => u.role === 'professeur').length);
        
      })
      .catch(err => console.error('Erreur chargement utilisateurs :', err));

    axios.get('http://localhost:5000/api/messages/all')
      .then(res =>{
        setMessagesCount(res.data.length);
    })
    .catch(err => console.error('Erreur chargement message :', err));
    // 🔹 Récupérer les cours
    axios.get('http://localhost:5000/api/admin/courses')
      .then(res => {
        setCoursCount(res.data.length);
      })
      .catch(err => console.error('Erreur chargement cours :', err));

    // 🔹 Récupérer les messages (optionnel)
    // axios.get('http://localhost:5000/api/messages')
    //   .then(res => setMessagesCount(res.data.length))
    //   .catch(err => console.error('Erreur chargement messages :', err));
  }, []);

  return (
    <div className="dashboard">
      <h2>Bienvenue administrateur 🛡️ {userName}</h2>

      <div className="stats">
        <div className="stat">🧑‍🎓 Étudiants: {etudiantsCount}</div>
        <div className="stat">👨‍🏫 Professeurs: {professeursCount}</div>
        <div className="stat">📚 Cours: {coursCount}</div>
        <div className="stat">💬 Messages: {messagesCount}</div>
      </div>

     
    </div>
  );
};

export default AdminDashboard;
