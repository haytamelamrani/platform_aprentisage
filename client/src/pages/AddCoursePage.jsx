import React, { useState } from 'react';
import '../styles/AddCoursePage.css';

function AddCoursePage({ darkMode }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [erreur, setErreur] = useState('');

  const [pdfs, setPdfs] = useState([{ file: null, text: '' }]);
  const [images, setImages] = useState([{ file: null, comment: '' }]);
  const [videos, setVideos] = useState([{ file: null, comment: '' }]);
  const [textes, setTextes] = useState([{ contenu: '' }]);

  const useremail = localStorage.getItem('email');

  const ajouterPdf = () => setPdfs([...pdfs, { file: null, text: '' }]);
  const ajouterImage = () => setImages([...images, { file: null, comment: '' }]);
  const ajouterVideo = () => setVideos([...videos, { file: null, comment: '' }]);
  const ajouterTexte = () => setTextes([...textes, { contenu: '' }]);

  const supprimerPdf = (index) => setPdfs(pdfs.filter((_, i) => i !== index));
  const supprimerImage = (index) => setImages(images.filter((_, i) => i !== index));
  const supprimerVideo = (index) => setVideos(videos.filter((_, i) => i !== index));
  const supprimerTexte = (index) => setTextes(textes.filter((_, i) => i !== index));

  const envoyerCours = async (e) => {
    e.preventDefault();

    if (!titre.trim() || !description.trim()) {
      setErreur("Le titre et la description sont obligatoires.");
      return;
    }

    setErreur('');

    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("emailProf", useremail);
    formData.append("textes", JSON.stringify(textes));

    // PDFs
    pdfs.forEach((pdf) => {
      if (pdf.file) formData.append("pdfs", pdf.file);
    });
    formData.append("pdfDescriptions", JSON.stringify(pdfs.map(pdf => pdf.text)));

    // Images
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });
    formData.append("imageDescriptions", JSON.stringify(images.map(img => img.comment)));

    // Vidéos
    videos.forEach((vid) => {
      if (vid.file) formData.append("video", vid.file);
    });
    formData.append("commentaireVideo", videos[0]?.comment || "");

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
        setVideos([{ file: null, comment: '' }]);
        setTextes([{ contenu: '' }]);
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
        <input
          type="text"
          placeholder="Titre du cours"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <textarea
          placeholder="Description du cours"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

        <hr />
        <h3>Ajouter des PDFs</h3>
        {pdfs.map((pdf, index) => (
          <div key={index}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const updated = [...pdfs];
                updated[index].file = e.target.files[0];
                setPdfs(updated);
              }}
            />
            <textarea
              placeholder="Description du PDF"
              value={pdf.text}
              onChange={(e) => {
                const updated = [...pdfs];
                updated[index].text = e.target.value;
                setPdfs(updated);
              }}
            />
            <button type="button" onClick={() => supprimerPdf(index)} className="btn-delete">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={ajouterPdf}>Ajouter un autre PDF</button>

        <hr />
        <h3>Ajouter des Images</h3>
        {images.map((img, index) => (
          <div key={index}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const updated = [...images];
                updated[index].file = e.target.files[0];
                setImages(updated);
              }}
            />
            <textarea
              placeholder="Commentaire sur l'image"
              value={img.comment}
              onChange={(e) => {
                const updated = [...images];
                updated[index].comment = e.target.value;
                setImages(updated);
              }}
            />
            <button type="button" onClick={() => supprimerImage(index)} className="btn-delete">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={ajouterImage}>Ajouter une autre Image</button>

        <hr />
        <h3>Ajouter des Vidéos</h3>
        {videos.map((vid, index) => (
          <div key={index}>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const updated = [...videos];
                updated[index].file = e.target.files[0];
                setVideos(updated);
              }}
            />
            <textarea
              placeholder="Commentaire sur la vidéo"
              value={vid.comment}
              onChange={(e) => {
                const updated = [...videos];
                updated[index].comment = e.target.value;
                setVideos(updated);
              }}
            />
            <button type="button" onClick={() => supprimerVideo(index)} className="btn-delete">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={ajouterVideo}>Ajouter une autre Vidéo</button>

        <hr />
        <h3>Ajouter des textes (contenu écrit ou lien )</h3>
        {textes.map((t, index) => (
          <div key={index}>
            <textarea
              placeholder="Contenu du texte"
              value={t.contenu}
              onChange={(e) => {
                const updated = [...textes];
                updated[index].contenu = e.target.value;
                setTextes(updated);
              }}
            />
            <button type="button" onClick={() => supprimerTexte(index)} className="btn-delete">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={ajouterTexte}>Ajouter un autre texte</button>

        <hr />
        <button type="submit">Créer le Cours</button>
      </form>
    </div>
  );
}

export default AddCoursePage;
