import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile'; // ✅ profil utilisateur

import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import OtpVerificationPage from './pages/OtpVerificationPage';

import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Logout from './pages/Logout';

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
        {/* Pages publiques */}
        <Route path="/" element={<HomePage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/login" element={<LoginPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/register" element={<RegisterPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/forgot-password" element={<ForgetPassword darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/reset-password/:token" element={<ResetPassword darkMode={darkMode} />} />
        <Route path="/about" element={<AboutPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/features" element={<FeaturesPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/verify-otp" element={<OtpVerificationPage darkMode={darkMode} />} />

        {/* Page profil utilisateur */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile darkMode={darkMode} />
            </ProtectedRoute>
          }
        />

        {/* Dashboards sécurisés */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Déconnexion */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;