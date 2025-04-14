import React from 'react';

const TeacherDashboard = () => {
  const userName = localStorage.getItem('userName');

  return (
    <div className="dashboard">
      <h2>Bienvenue professeur 👩‍🏫 {userName}</h2>
      <p>Voici votre tableau de bord pour gérer les cours et les étudiants.</p>
      <button onClick={() => window.location.href = '/logout'} style={{ marginTop: '20px' }}>
  Déconnexion
</button>
    </div>
  );
};

export default TeacherDashboard;
