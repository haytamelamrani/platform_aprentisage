import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomePage.css';

const HomePage = ({ darkMode, toggleMode }) => {
  return (
    <div className="homepage">

      <section className="hero">
        <div className="hero-content">
          <h1>Apprenez à votre rythme,<br />Progressez intelligemment 🚀</h1>
          <p>Une plateforme d'apprentissage intuitive, intelligente et immersive.</p>
          <div className="hero-buttons">
            <a href="/register" className="btn">Commencer</a>
            <a href="#features" className="btn-outline">Découvrir</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg" alt="learning" />
        </div>
      </section>

      <section className="features" id="features">
        <h2>Fonctionnalités principales</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📚 Cours enrichis</h3>
            <p>Vidéo, quiz, PDF, tout ce qu’il vous faut pour réussir.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ IA intégrée</h3>
            <p>Un assistant IA pour répondre à vos questions en temps réel.</p>
          </div>
          <div className="feature-card">
            <h3>🧭 Suivi intelligent</h3>
            <p>Progresser, réviser, recommencer : votre parcours personnalisé.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 SmartLearn. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default HomePage;
