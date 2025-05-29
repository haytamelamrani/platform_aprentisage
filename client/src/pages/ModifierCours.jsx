import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ModifierCours.css';

const ModifierCours = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    titre: '',
    description: '',
    nomProf: '',
    textes: [],
    pdfs: [],
    images: [],
    video: [],
  });

  const [newPdf, setNewPdf] = useState(null);
  const [newPdfDesc, setNewPdfDesc] = useState('');
  const [newImg, setNewImg] = useState(null);
  const [newImgComment, setNewImgComment] = useState('');
  const [newVid, setNewVid] = useState(null);
  const [newVidComment, setNewVidComment] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => {
        const data = res.data;
        setCourse({
          ...data,
          textes: data.textes || [],
          pdfs: data.pdfs || [],
          images: data.images || [],
          video: data.video || []
        });
      })
      .catch(err => console.error('Erreur chargement cours:', err));
  }, [id]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleTextChange = (i, value) => {
    const updated = [...course.textes];
    updated[i] = { contenu: value };
    setCourse({ ...course, textes: updated });
  };

  const addText = () => {
    setCourse({ ...course, textes: [...course.textes, { contenu: '' }] });
  };

  const supprimerFichier = async (type, filename) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}/delete/${type}/${filename}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(prev => ({
        ...prev,
        [type]: prev[type].filter(f => f.filename !== filename)
      }));
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("❌ Erreur lors de la suppression du fichier");
    }
  };

  const uploadFichier = async (type, file, meta, metaKey) => {
    if (!file) return;
    const formData = new FormData();
    formData.append(type, file);
    if (meta) formData.append(metaKey, JSON.stringify([meta]));

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:5000/api/courses/upload-${type}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setCourse(prev => ({
        ...prev,
        [type]: [...prev[type], res.data]
      }));
    } catch (err) {
      console.error(`Erreur upload ${type}:`, err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const updatedData = {
        ...course,
        textes: course.textes.map(t => t.contenu), // uniquement le texte brut
      };

      await axios.put(`http://localhost:5000/api/courses/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Cours mis à jour !");
      navigate('/admin/cours');
    } catch (error) {
      console.error("Erreur modification :", error.response?.data || error);
      alert("❌ Erreur : " + (error.response?.data?.message || "inconnue"));
    }
  };

  return (
    <div className="modifier-cours-container">
      <h2>🛠️ Modifier le cours</h2>
      <form onSubmit={handleSubmit} className="modifier-cours-form">
        <label>Titre :</label>
        <input type="text" name="titre" value={course.titre} onChange={handleChange} />

        <label>Description :</label>
        <textarea name="description" value={course.description} onChange={handleChange} />

        <label>Nom du professeur :</label>
        <input type="text" name="nomProf" value={course.nomProf} onChange={handleChange} />

        <h3>📝 Textes</h3>
        {course.textes.map((txt, i) => (
          <textarea key={i} value={txt.contenu} onChange={e => handleTextChange(i, e.target.value)} />
        ))}
        <button type="button" onClick={addText}>➕ Ajouter un texte</button>

        <h3>📄 PDFs</h3>
        {course.pdfs.map((pdf, i) => (
          <div key={i}>
            <a href={`http://localhost:5000/uploads/${pdf.filename}`} target="_blank" rel="noreferrer">{pdf.filename}</a>
            <p>{pdf.description}</p>
            <button type="button" onClick={() => supprimerFichier('pdfs', pdf.filename)}>❌</button>
          </div>
        ))}
        <input type="file" onChange={e => setNewPdf(e.target.files[0])} />
        <input type="text" placeholder="Description PDF" value={newPdfDesc} onChange={e => setNewPdfDesc(e.target.value)} />
        <button type="button" onClick={() => uploadFichier('pdfs', newPdf, newPdfDesc, 'pdfDescriptions')}>📤 Upload PDF</button>

        <h3>🖼️ Images</h3>
        {course.images.map((img, i) => (
          <div key={i}>
            <img src={`http://localhost:5000/uploads/${img.filename}`} width="100" alt="cours" />
            <p>{img.comment}</p>
            <button type="button" onClick={() => supprimerFichier('images', img.filename)}>❌</button>
          </div>
        ))}
        <input type="file" onChange={e => setNewImg(e.target.files[0])} />
        <input type="text" placeholder="Commentaire image" value={newImgComment} onChange={e => setNewImgComment(e.target.value)} />
        <button type="button" onClick={() => uploadFichier('images', newImg, newImgComment, 'imageDescriptions')}>📤 Upload Image</button>

        <h3>🎬 Vidéos</h3>
        {course.video.map((vid, i) => (
          <div key={i}>
            <video width="220" controls src={`http://localhost:5000/uploads/${vid.filename}`} />
            <p>{vid.comment}</p>
            <button type="button" onClick={() => supprimerFichier('video', vid.filename)}>❌</button>
          </div>
        ))}
        <input type="file" onChange={e => setNewVid(e.target.files[0])} />
        <input type="text" placeholder="Commentaire vidéo" value={newVidComment} onChange={e => setNewVidComment(e.target.value)} />
        <button type="button" onClick={() => uploadFichier('video', newVid, newVidComment, 'commentaireVideo')}>📤 Upload Vidéo</button>

        <button type="submit">💾 Enregistrer</button>
      </form>
    </div>
  );
};

export default ModifierCours;
