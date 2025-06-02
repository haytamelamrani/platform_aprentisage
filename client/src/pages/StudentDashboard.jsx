import React from 'react';

const StudentDashboard = () => {
  const userName = localStorage.getItem('userName');

  return (
    <div className="dashboard">
       
      <h2>Bienvenue étudiant 👨‍🎓 {userName}</h2>
      <p>Voici ton espace personnel.</p>
     
    </div>
  );
};

export default StudentDashboard;
