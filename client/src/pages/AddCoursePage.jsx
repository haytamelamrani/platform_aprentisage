import React, { useState } from 'react';
import '../styles/AddCoursePage.css';

function AddCoursePage({ darkMode }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const [pdfs, setPdfs] = useState([{ file: null, text: '' }]);
  const [images, setImages] = useState([{ file: null, comment: '' }]);
  const [video, setVideo] = useState(null);
  const [commentaireVideo, setCommentaireVideo] = useState('');

  const ajouterPdf = () => setPdfs([...pdfs, { file: null, text: '' }]);
  const ajouterImage = () => setImages([...images, { file: null, comment: '' }]);

  const supprimerPdf = (index) => setPdfs(pdfs.filter((_, i) => i !== index));
  const supprimerImage = (index) => setImages(images.filter((_, i) => i !== index));
  const supprimerVideo = () => { setVideo(null); setCommentaireVideo(''); };

  const envoyerCours = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    
    // Ajouter les fichiers PDF
    pdfs.forEach((pdf) => {
      if (pdf.file) formData.append("pdfs", pdf.file);
    });
    formData.append("pdfDescriptions", JSON.stringify(pdfs.map(pdf => pdf.text)));

    // Ajouter les images
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });
    formData.append("imageDescriptions", JSON.stringify(images.map(img => img.comment)));

    // Ajouter la vidéo
    if (video) formData.append("video", video);
    formData.append("commentaireVideo", commentaireVideo);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/courses/add", {
      method: "POST",
      headers: {
      Authorization: `Bearer ${token}`
      },
      body: formData
      });
      
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setTitre('');
        setDescription('');
        setPdfs([{ file: null, text: '' }]);
        setImages([{ file: null, comment: '' }]);
        setVideo(null);
        setCommentaireVideo('');
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error("Erreur d’envoi :", error);
      alert("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className={`add-course-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Créer un Nouveau Cours</h2>
      <form onSubmit={envoyerCours}>

        <input type="text" placeholder="Titre du cours" value={titre} onChange={(e) => setTitre(e.target.value)} />
        <textarea placeholder="Description du cours" value={description} onChange={(e) => setDescription(e.target.value)} />

        <hr />

        <h3>Ajouter des PDFs</h3>
        {pdfs.map((pdf, index) => (
          <div key={index}>
            <input type="file" accept=".pdf" onChange={(e) => {
              const updated = [...pdfs];
              updated[index].file = e.target.files[0];
              setPdfs(updated);
            }} />
            <textarea placeholder="Description du PDF" value={pdf.text} onChange={(e) => {
              const updated = [...pdfs];
              updated[index].text = e.target.value;
              setPdfs(updated);
            }} />
            <button type="button" onClick={() => supprimerPdf(index)} className="btn-delete">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={ajouterPdf}>Ajouter un autre PDF</button>

        <hr />

        <h3>Ajouter des Images</h3>
        {images.map((img, index) => (
          <div key={index}>
            <input type="file" accept="image/*" onChange={(e) => {
              const updated = [...images];
              updated[index].file = e.target.files[0];
              setImages(updated);
            }} />
            <textarea placeholder="Commentaire sur l'image" value={img.comment} onChange={(e) => {
              const updated = [...images];
              updated[index].comment = e.target.value;
              setImages(updated);
            }} />
            <button type="button" onClick={() => supprimerImage(index)} className="btn-delete">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={ajouterImage}>Ajouter une autre Image</button>

        <hr />

        <h3>Ajouter une Vidéo</h3>
        {video ? (
          <div>
            <p>Vidéo sélectionnée : {video.name}</p>
            <textarea placeholder="Commentaire sur la vidéo" value={commentaireVideo} onChange={(e) => setCommentaireVideo(e.target.value)} />
            <button type="button" onClick={supprimerVideo} className="btn-delete">Supprimer la Vidéo</button>
          </div>
        ) : (
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        )}

        <button type="submit">Créer le Cours</button>
      </form>
    </div>
  );
}

export default AddCoursePage;
