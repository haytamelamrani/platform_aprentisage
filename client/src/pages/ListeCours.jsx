import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ListeCours.css';

const ListeCours = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/courses');
    setCourses(res.data);
  };

  const deleteCourse = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/courses/${id}`);
    fetchCourses();
  };

  useEffect(() => { fetchCourses(); }, []);

  return (
    <div className="cours-container">
      <h2>📚 Liste des Cours</h2>
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Professeur</th>
            <th>Ajouté le</th>
            <th>Fichiers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.titre}</td>
              <td>{c.nomProf}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                {c.fichiers.pdfs.length} PDF / {c.fichiers.images.length} Img / {c.fichiers.videos.length} Vid
              </td>
              <td>
                <button onClick={() => deleteCourse(c._id)}>🗑️ Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeCours;
