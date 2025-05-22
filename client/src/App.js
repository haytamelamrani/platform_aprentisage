import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import NavbarProf from './components/NavbarProf';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import OtpVerificationPage from './pages/OtpVerificationPage';

import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Logout from './pages/Logout';
import AddCoursePage from './pages/AddCoursePage';
import AddQCMPage from './pages/AddQcmPage';
import CoursesPage from './pages/Courses';
import CourseDetailsPage from './pages/CourseDetails';
import QcmPage from './pages/QcmPage';

import HtmlRunner from './pages/Game';
function AppContent({ darkMode, toggleMode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {currentPath.startsWith('/Prof') ? (
        <NavbarProf darkMode={darkMode} toggleMode={toggleMode} />
      ) : (
        <Navbar darkMode={darkMode} toggleMode={toggleMode} />
      )}
        

      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/login" element={<LoginPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/register" element={<RegisterPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/forgot-password" element={<ForgetPassword darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/reset-password/:token" element={<ResetPassword darkMode={darkMode} />} />
        <Route path="/about" element={<AboutPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/features" element={<FeaturesPage darkMode={darkMode} toggleMode={toggleMode} />} />
        <Route path="/verify-otp" element={<OtpVerificationPage darkMode={darkMode} />} />
        <Route path="/courses" element={<CoursesPage darkMode={darkMode} />} />
        <Route path="/game" element={<HtmlRunner darkMode={darkMode} />} />

        <Route path="/profile" element={<ProtectedRoute><UserProfile darkMode={darkMode} /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

        <Route path="/Prof" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/Prof/addcours" element={<ProtectedRoute><AddCoursePage darkMode={darkMode} toggleMode={toggleMode} /></ProtectedRoute>} />
        <Route path="/Prof/addqcm" element={<ProtectedRoute><AddQCMPage darkMode={darkMode} toggleMode={toggleMode} /></ProtectedRoute>} />
        <Route path="/Prof/cours" element={<ProtectedRoute><CoursesPage darkMode={darkMode} /></ProtectedRoute>} />
        <Route path="/Prof/courses/:titre" element={<ProtectedRoute><CourseDetailsPage darkMode={darkMode} /></ProtectedRoute>}/>
        <Route path="/Prof/Qcm/:idcour" element={<ProtectedRoute><QcmPage darkMode={darkMode} /></ProtectedRoute>} />



        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <Router>
      <AppContent darkMode={darkMode} toggleMode={toggleMode} />
    </Router>
  );
}

export default App;
