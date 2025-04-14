import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgetPassword from './pages/ForgetPassword';

import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import OtpVerificationPage from './pages/OtpVerificationPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <Router>

      <Navbar darkMode={darkMode} toggleMode={toggleMode} />
      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/login" element={<LoginPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/register" element={<RegisterPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/forgot-password" element={<ForgetPassword darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/about" element={<AboutPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/features" element={<FeaturesPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/verify-otp" element={<OtpVerificationPage darkMode={darkMode} />} />


      </Routes>
    </Router>
  );
}

export default App;
