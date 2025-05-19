import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 👈 Nécessaire
import '../styles/Courses.css';

const CoursesPage = ({ darkMode }) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const filteredCourses = courses.filter((course) =>
    course.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`courses-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Cours disponibles</h1>

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
        filteredCourses.map((course) => (
          <Link
            key={course._id}
            to={isLoggedIn ? `/Prof/courses/${course.titre}` : "/login"}
          >
            <div className="course-box">
              <h2>{course.titre}</h2>
              <p>{course.description}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default CoursesPage;
