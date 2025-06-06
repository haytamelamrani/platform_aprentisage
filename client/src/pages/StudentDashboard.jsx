import React from 'react';

const StudentDashboard = () => {
  const userName = localStorage.getItem('userName');
  const userlastName = localStorage.getItem('prenom');
  return (
    <div className="dashboard">
       
      <h2>Bienvenue étudiant 👨‍🎓 {userName} {userlastName}</h2>
      <p>Voici ton espace personnel.</p>
     
    </div>
  );
};

export default StudentDashboard;
