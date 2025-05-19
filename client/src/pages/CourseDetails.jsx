import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CourseDetails.css';

const CourseDetailsPage = ({ darkMode }) => {
  const { titre } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/search?titre=${titre}`)
      .then((res) => {
        if (res.data.length > 0) {
          setCourse(res.data[0]);
        } else {
          setError('Cours non trouvé');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Erreur lors de la récupération du cours');
      });
  }, [titre]);

  if (error) return <p>{error}</p>;
  if (!course) return <p>Chargement...</p>;

  return (
    <div className={`course-details-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>{course.titre}</h1>
      <p>{course.description}</p>

      {course.pdfs.length > 0 && (
        <>
          <h2>📄 PDFs</h2>
          {course.pdfs.map((pdf, idx) => (
            <div key={idx} className="pdf-card">
              <h3>{pdf.description}</h3>
              <div className="pdf-frame-container">
                <iframe
                  src={`http://localhost:5000/uploads/${pdf.filename}`}
                  className="pdf-frame"
                  title={`pdf-${idx}`}
                />
              </div>
              <a
                href={`http://localhost:5000/uploads/${pdf.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-link"
              >
                📥 Télécharger le PDF
              </a>
            </div>
          ))}
        </>
      )}

      {course.images.length > 0 && (
        <>
          <h2>🖼️ Images</h2>
          <div className="image-gallery">
            {course.images.map((img, idx) => (
              <div key={idx} className="image-item">
                <img
                  src={`http://localhost:5000/uploads/${img.filename}`}
                  alt={`img-${idx}`}
                />
                <p>{img.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {course.video && (
        <>
          <h2>🎬 Vidéo</h2>
          <video width="100%" height="480" controls>
            <source src={`http://localhost:5000/uploads/${course.video.filename}`} type="video/mp4" />
            Votre navigateur ne prend pas en charge la vidéo.
          </video>
          <p>{course.video.comment}</p>
        </>
      )}
    </div>
  );
};

export default CourseDetailsPage;
