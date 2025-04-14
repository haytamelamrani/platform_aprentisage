import React from 'react';

const AdminDashboard = () => {
  const userName = localStorage.getItem('userName');

  return (
    <div className="dashboard">
      <h2>Bienvenue administrateur 🛡️ {userName}</h2>
      <p>Panneau de contrôle global du système.</p>
      <button onClick={() => window.location.href = '/logout'} style={{ marginTop: '20px' }}>
  Déconnexion
</button>
    </div>
  );
};

export default AdminDashboard;
