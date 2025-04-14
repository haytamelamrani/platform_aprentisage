import React from 'react';

const StudentDashboard = () => {
  const userName = localStorage.getItem('userName');

  return (
    <div className="dashboard">
      <h2>Bienvenue étudiant 👨‍🎓 {userName}</h2>
      <p>Voici ton espace personnel.</p>
      <button onClick={() => window.location.href = '/logout'} style={{ marginTop: '20px' }}>
  Déconnexion
</button>
    </div>
  );
};

export default StudentDashboard;
