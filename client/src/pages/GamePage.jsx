import React from 'react';
import videoHTML from '../assets/video/vid1.mp4';
import videoSQL from '../assets/video/vid2.mp4';
import videoSecurity from '../assets/video/vid3.mp4';
import vid4 from '../assets/video/vid4.mp4';
import vid5 from '../assets/video/vid5.mp4';
import vid6 from '../assets/video/vid6.mp4';
import '../styles/Gamepage.css'; 
import { Link } from 'react-router-dom';

const GamePage = ({darkMode}) => {
  return (
    <div className="games-page">
      <Link to="/etudiant/GameCss" className="game-card">
        <video className="background-video" src={videoHTML} autoPlay loop muted playsInline />
        <div className="game-info">
          <p className="game-title">Jeu d’apprentissage HTML/CSS</p>
          <p className="game-description">
            Plonge dans un monde interactif pour apprendre le HTML et le CSS en t'amusant.
          </p>
        </div>
      </Link>
      

      <Link to="/etudiant/GameSql" className="game-card">
        <video className="background-video" src={videoSQL} autoPlay loop muted playsInline />
        <div className="game-info">
          <p className="game-title">Jeu SQL : Attrape le criminel</p>
          <p className="game-description">
            Résous des énigmes SQL pour retrouver le coupable et sauver la base de données.
          </p>
        </div>
      </Link>
      <Link to="/etudiant/SecurityGame" className="game-card">
        <video className="background-video" src={videoSecurity} autoPlay loop muted playsInline />
        <div className="game-info">
          <p className="game-title">Jeu de cybersécurité </p>
          <p className="game-description">
              Apprends à te défendre contre les attaques (SQL, XSS, etc.) en utilisant les bonnes commandes de sécurité.
          </p>
        </div>
      </Link>
      <Link to="/jeu-css" className="game-card">
        <video className="background-video" src={vid4} autoPlay loop muted playsInline />
        <div className="game-info">
          <p className="game-title">Jeu d’apprentissage HTML/CSS</p>
          <p className="game-description">
            Plonge dans un monde interactif pour apprendre le HTML et le CSS en t'amusant.
          </p>
        </div>
      </Link>

      <Link to="/jeu-sql" className="game-card">
        <video className="background-video" src={vid5} autoPlay loop muted playsInline />
        <div className="game-info">
          <p className="game-title">Jeu SQL : Attrape le criminel</p>
          <p className="game-description">
            Résous des énigmes SQL pour retrouver le coupable et sauver la base de données.
          </p>
        </div>
      </Link>
      <Link to="/jeu-css" className="game-card">
        <video className="background-video" src={vid6} autoPlay loop muted playsInline />
        <div className="game-info">
          <p className="game-title">Jeu de cybersécurité </p>
          <p className="game-description">
              Apprends à te défendre contre les attaques (SQL, XSS, etc.) en utilisant les bonnes commandes de sécurité.
          </p>
        </div>
      </Link>
    </div>
  );
};

export default GamePage;
