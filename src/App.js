import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <Router>

      <Navbar darkMode={darkMode} toggleMode={toggleMode} />
            {/* Affiche la navbar principale */}
      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} toggleMode={toggleMode} />} />
        


      </Routes>
    </Router>
  );
}

export default App;
