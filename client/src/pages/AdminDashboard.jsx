import React, { useEffect, useState } from 'react';
import '../styles/AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const userName = localStorage.getItem('userName');
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    messages: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Bienvenue administrateur 🛡️ {userName}</h2>
      <div className="stats-container">
        <div className="stat-box">👨‍🎓 Étudiants: {stats.students}</div>
        <div className="stat-box">👨‍🏫 Professeurs: {stats.teachers}</div>
        <div className="stat-box">📚 Cours: {stats.courses}</div>
        <div className="stat-box">💬 Messages: {stats.messages}</div>
      </div>

      <div className="quick-actions">
        <button onClick={() => window.location.href = '/admin/courses'}>📂 Gérer les cours</button>
        <button onClick={() => window.location.href = '/admin/users'}>👥 Gérer les utilisateurs</button>
        <button onClick={() => window.location.href = '/admin/messages'}>✉️ Voir les messages</button>
        <button onClick={() => window.location.href = '/logout'}>🚪 Déconnexion</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
