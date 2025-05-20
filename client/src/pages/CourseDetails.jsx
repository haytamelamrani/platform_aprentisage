import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CourseDetails.css';

const CourseDetailsPage = ({ darkMode }) => {
  const { titre } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  // 🔗 Fonction pour transformer les URLs en liens HTML cliquables
  const convertLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  };

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

      {/* 📝 Textes */}
      {course.textes && course.textes.length > 0 && (
        <>
          <h2>📝 Contenu du cours</h2>
          {course.textes.map((txt, idx) => (
            <div key={idx} className="texte-block">
              <p
                dangerouslySetInnerHTML={{
                  __html: convertLinks(txt.contenu)
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* 📄 PDFs */}
      {course.pdfs && course.pdfs.length > 0 && (
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

      {/* 🖼️ Images */}
      {course.images && course.images.length > 0 && (
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

      {/* 🎬 Vidéos */}
      {course.video && course.video.length > 0 && (
        <>
          <h2>🎬 Vidéos</h2>
          {course.video.map((vid, idx) => (
            <div key={idx} className="video-item">
              <video width="100%" height="480" controls>
                <source src={`http://localhost:5000/uploads/${vid.filename}`} type="video/mp4" />
                Votre navigateur ne prend pas en charge la vidéo.
              </video>
              <p>{vid.comment}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CourseDetailsPage;
