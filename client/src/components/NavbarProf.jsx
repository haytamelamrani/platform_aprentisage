import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import menuIcon from '../assets/menu.png';

const NavbarProf = ({ darkMode, toggleMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est connecté (token existe)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Link to="/Prof" className="logo">SmartLearn</Link>

      <img
        src={menuIcon}
        alt="menu"
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/Prof/cours">Cours</Link></li>
        <li><Link to="/Prof/addcours">Gestion Cour</Link></li>
        <li><Link to="/Prof/addqcm">Gestion Quiz</Link></li>
        <li><Link to="">IA</Link></li>

        {!isLoggedIn && (
          <>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register" className="btn-register">S'inscrire</Link></li>
          </>
        )}

        {isLoggedIn && (
          <li>
            <button onClick={handleLogout} className="btn-register logout-btn">
              Déconnexion
            </button>
          </li>
        )}

        <li>
          <button onClick={toggleMode} className="mode-toggle">
            {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarProf;
