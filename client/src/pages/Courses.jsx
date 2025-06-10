import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Courses.css';
import AverageStars from '../components/AverageStars';

const CoursesPage = ({ darkMode }) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qcmPassesUniques, setQcmPassesUniques] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/all')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des cours :', error);
      });
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) return;

    axios.get(`http://localhost:5000/api/progress/${email}`)
      .then((res) => {
        const scores = res.data?.scores || [];
        const coursUniques = new Set(scores.map(score => score.nomCours.trim()));
        setQcmPassesUniques(coursUniques.size);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des progressions :", err);
      });
  }, []);

  const totalCours = courses.length;
  const progression = totalCours > 0 ? Math.round((qcmPassesUniques / totalCours) * 100) : 0;

  const filteredCourses = courses.filter((course) =>
    course.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`courses-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      
      <div className="courses-header">
        <h1>Cours disponibles</h1>
        <div className="progress-badge">
          <div className="progress-fill" style={{ width: `${progression}%` }}></div>
          <span>Progression : {qcmPassesUniques} / {totalCours}</span>
        </div>
      </div>

      <input
        type="text"
        placeholder="Rechercher un cours par titre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredCourses.length === 0 ? (
        <p>Aucun cours trouvé.</p>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              to={isLoggedIn ? `/Prof/courses/${course.titre}` : "/login"}
            >
              <div className="course-box">
                <div className='course-box-header'>
                  <h2>{course.titre}</h2>
                  <AverageStars courseId={course._id} />
                </div>
                <p>{course.description}</p>
              </div>
              
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
