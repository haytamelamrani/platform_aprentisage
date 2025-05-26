import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ListeCours.css';

const ListeCours = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/courses');
      setCourses(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement cours :", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce cours ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("❌ Erreur suppression cours :", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="cours-container">
      <h2>📚 Liste des Cours</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : courses.length === 0 ? (
        <p>Aucun cours trouvé.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Professeur</th>
              <th>Description</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course.titre}</td>
                <td>{course.nomProf}</td>
                <td>{course.description}</td>
                <td>{new Date(course.createdAt).toLocaleDateString()}</td>
              
                <td>
  <button className="edit-btn" onClick={() => window.location.href = `/admin/cours/modifier/${course._id}`}>
    ✏️ Modifier
  </button>
  <button className="delete-btn" onClick={() => deleteCourse(course._id)}>
    🗑️ Supprimer
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeCours;
