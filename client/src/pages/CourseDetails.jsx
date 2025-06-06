import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, FileText, ImageIcon, Video, CheckSquare, AlertCircle, Download } from 'lucide-react';
import '../styles/CourseDetails.css';
import RatingStars from '../components/RatingStars';

const API_BASE_URL = 'http://localhost:5000';

const CourseDetailsPage = ({ darkMode }) => {
  const { titre } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);

  const convertLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">${url}</a>`;
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/courses/search?titre=${encodeURIComponent(titre)}`)
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [titre]);

  const handleSendQuestion = async () => {
    const senderEmail = localStorage.getItem('email');
    if (!question.trim()) return alert("❌ Veuillez écrire votre question.");
    if (!senderEmail || !course?.titre || !course?.emailProf)
      return alert("❌ Informations manquantes pour envoyer le message.");
  
    setSending(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/messages/send`, {
        senderEmail,
        content: question,
        courseTitle: course.titre,
        recipientEmail: course.emailProf, // ✅ nouvelle ligne
      });
      alert(res.data.message);
      setQuestion('');
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return (
      <div className={`course-details-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-section"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={`course-details-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <h2>Erreur</h2>
          <p>{error || "Aucun cours trouvé avec ce titre."}</p>
        </div>
      </div>
    );
  }

  const hasTextes = course.textes?.length > 0;
  const hasPdfs = course.pdfs?.length > 0;
  const hasImages = course.images?.length > 0;
  const hasVideos = course.video?.length > 0;

  return (
    <div className={`course-details-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="course-header">
        <h1>{course.titre}</h1>
        <p className="course-description">{course.description}</p>
      </header>

      <div className="course-tabs">
        <button className={`tab-button ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
          <BookOpen size={18} /><span>Contenu</span>
        </button>
        {hasPdfs && (
          <button className={`tab-button ${activeTab === 'pdfs' ? 'active' : ''}`} onClick={() => setActiveTab('pdfs')}>
            <FileText size={18} /><span>PDFs</span>
          </button>
        )}
        {hasImages && (
          <button className={`tab-button ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>
            <ImageIcon size={18} /><span>Images</span>
          </button>
        )}
        {hasVideos && (
          <button className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
            <Video size={18} /><span>Vidéos</span>
          </button>
        )}
      </div>

      <div className="course-content">
        {activeTab === 'content' && (
          <div className="content-section">
            <h2 className="section-title"><BookOpen size={20} className="section-icon" />Contenu du cours</h2>
            {hasTextes ? course.textes.map((txt, idx) => (
              <div key={idx} className="texte-block">
                <p dangerouslySetInnerHTML={{ __html: convertLinks(txt.contenu) }} />
              </div>
            )) : <p className="empty-message">Aucun contenu textuel disponible.</p>}
          </div>
        )}

        {activeTab === 'pdfs' && (
          <div className="content-section">
            <h2 className="section-title"><FileText size={20} className="section-icon" />PDFs</h2>
            <div className="pdf-grid">
              {course.pdfs.map((pdf, idx) => (
                <div key={idx} className="pdf-card">
                  <div className="pdf-header"><h3>{pdf.description}</h3></div>
                  <div className="pdf-frame-container">
                    <iframe src={`${API_BASE_URL}/uploads/${pdf.filename}`} className="pdf-frame" title={`pdf-${idx}`} />
                  </div>
                  <a href={`${API_BASE_URL}/uploads/${pdf.filename}`} target="_blank" rel="noopener noreferrer" className="download-link">
                    <Download size={16} /> Télécharger le PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="content-section">
            <h2 className="section-title"><ImageIcon size={20} className="section-icon" />Images</h2>
            <div className="image-gallery">
              {course.images.map((img, idx) => (
                <div key={idx} className="image-item">
                  <div className="image-container">
                    <img src={`${API_BASE_URL}/uploads/${img.filename}`} alt={img.comment || `Image ${idx + 1}`} />
                  </div>
                  {img.comment && <p className="image-comment">{img.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="content-section">
            <h2 className="section-title"><Video size={20} className="section-icon" />Vidéos</h2>
            <div className="video-grid">
              {course.video.map((vid, idx) => (
                <div key={idx} className="video-item">
                  <div className="video-container">
                    <video controls>
                      <source src={`${API_BASE_URL}/uploads/${vid.filename}`} type="video/mp4" />
                      Votre navigateur ne prend pas en charge la vidéo.
                    </video>
                  </div>
                  {vid.comment && <p className="video-comment">{vid.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="qcm-section">
        <div className="qcm-content">
          <div className="qcm-info">
            <h2><CheckSquare size={24} className="qcm-icon" />Évaluation</h2>
            <p>Testez vos connaissances sur ce cours avec notre QCM interactif.</p>
          </div>
          <a href={`/Prof/Qcm/${course._id}`} className="qcm-button">Passer le QCM</a>
        </div>
      </div>

      {/* Envoi de question */}
      <div className="ask-question-section">
        <h2>❓ Une question sur ce cours ?</h2>
        <p>Envoyez un message au professeur pour plus de détails ou clarifications.</p>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Écrivez votre question ici..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid var(--border-color)',
            marginBottom: '10px',
            resize: 'vertical',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={handleSendQuestion}
          disabled={sending}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            float: 'right',
            cursor: 'pointer',
          }}
        >
          {sending ? 'Envoi...' : 'Envoyer la question'}
        </button>
      </div>
      <RatingStars courseId={course._id} />
    </div>
  );
};

export default CourseDetailsPage;
