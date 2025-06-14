import React from 'react';
import '../styles/GestionCours.css';
import { Link } from 'react-router-dom';

const GestionCours = ({ darkMode }) => {
  return (
    <div className={`gestion-cours-container ${darkMode ? 'dark-mode' : ''}`}>
      <Link to="/Prof/addcours" className="gestion-cours-card">
        <div className="cours-info">
          <p className="cours-title">➕ Ajouter un cours</p>
          <p className="cours-description">
            Créez un nouveau cours avec textes, vidéos, PDF et images.
          </p>
        </div>
      </Link>

      <Link to="/admin/cours" className="gestion-cours-card">
        <div className="cours-info">
          <p className="cours-title">🛠️ Modifier un cours</p>
          <p className="cours-description">
            Gérez et modifiez les cours existants facilement.
          </p>
        </div>
      </Link>
    </div>
  );
};

export default GestionCours;
