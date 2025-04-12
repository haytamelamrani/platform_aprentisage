import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import menuIcon from '../assets/menu.png'; // mets ici ton image menu.png

const Navbar = ({ darkMode, toggleMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
    <Link to="/" className="logo">SmartLearn</Link>

      <img
        src={menuIcon}
        alt="menu"
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/courses">Cours</Link></li>
        <li><Link to="/features">Fonctionnalités</Link></li>
        <li><Link to="/about">À propos</Link></li>
        <li><Link to="/login">Connexion</Link></li>
        <li><Link to="/register" className="btn-register">S'inscrire</Link></li>
        <li>
          <button onClick={toggleMode} className="mode-toggle">
            {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
