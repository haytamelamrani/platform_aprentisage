import React from 'react';
import '../styles/AboutPage.css';

const AboutPage = ({ darkMode, toggleMode }) => {
  return (
    <div className={`about-page ${darkMode ? 'dark-mode' : ''}`}>

      <div className="about-container">
        <h1>À propos de SmartLearn</h1>
        <p>
          SmartLearn est une plateforme d’apprentissage innovante qui combine
          l’intelligence artificielle, la pédagogie moderne et des outils interactifs pour
          permettre aux étudiants de progresser à leur rythme.
        </p>

        <section className="about-section">
          <h2>🎯 Notre mission</h2>
          <p>
            Offrir une éducation de qualité, accessible partout et à tout moment, pour aider
            les étudiants et les professionnels à atteindre leurs objectifs.
          </p>
        </section>

        <section className="about-section">
          <h2>💡 Nos valeurs</h2>
          <ul>
            <li>Innovation pédagogique</li>
            <li>Accessibilité pour tous</li>
            <li>Suivi intelligent et personnalisé</li>
            <li>Apprentissage actif et pratique</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
