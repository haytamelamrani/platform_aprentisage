import React from 'react';
import '../styles/GestionCours.css';

const GestionCours = ({ darkMode }) => {
  return (
    <div className={`gestion-cours-container ${darkMode ? 'dark-mode' : ''}`}>
      <a href="/Prof/addcours" className="gestion-cours-card">
        <div className="cours-info">
          <p className="cours-title">➕ Ajouter un cours</p>
          <p className="cours-description">
            Créez un nouveau cours avec textes, vidéos, PDF et images.
          </p>
        </div>
      </a>

      <a href="/admin/cours" className="gestion-cours-card">
        <div className="cours-info">
          <p className="cours-title">🛠️ Modifier un cours</p>
          <p className="cours-description">
            Gérez et modifiez les cours existants facilement.
          </p>
        </div>
      </a>
    </div>
  );
};

export default GestionCours;
