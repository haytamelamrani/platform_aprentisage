import React from 'react';
import '../styles/FeaturesPage.css';

const FeaturesPage = ({ darkMode }) => {
  return (
    <div className={`features-page ${darkMode ? 'dark-mode' : ''}`}>

      <div className="features-container">
        <h1>Fonctionnalités de SmartLearn ✨</h1>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📚 Cours interactifs</h3>
            <p>Accédez à des cours complets avec vidéos, documents PDF et évaluations.</p>
          </div>

          <div className="feature-card">
            <h3>🤖 Assistant IA</h3>
            <p>Posez vos questions en temps réel et recevez une aide personnalisée.</p>
          </div>

          <div className="feature-card">
            <h3>📝 Quiz dynamiques</h3>
            <p>Testez vos connaissances après chaque module avec des quiz corrigés.</p>
          </div>

          <div className="feature-card">
            <h3>📈 Suivi de progression</h3>
            <p>Visualisez votre avancement et vos résultats dans un tableau de bord intuitif.</p>
          </div>

          <div className="feature-card">
            <h3>👨‍🏫 Interface Professeur</h3>
            <p>Ajoutez des cours, gérez les étudiants et créez des quiz en toute autonomie.</p>
          </div>

          <div className="feature-card">
            <h3>🎨 Interface responsive</h3>
            <p>SmartLearn s’adapte à tous les écrans : ordinateur, tablette et mobile.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
