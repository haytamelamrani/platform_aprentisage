const Course = require('../models/Course');
const User = require('../models/User');
const { envoyerMessageParEmail } = require('../email/gestionemail');

// 📥 Ajouter un nouveau cours
exports.createCourse = async (req, res) => {
  try {
    const {
      titre,
      description,
      nomProf,
      pdfDescriptions,
      imageDescriptions,
      commentaireVideo,
      textes // ✅ ici on récupère les textes
    } = req.body;

    const parsedPdfDescriptions = pdfDescriptions ? JSON.parse(pdfDescriptions) : [];
    const parsedImageDescriptions = imageDescriptions ? JSON.parse(imageDescriptions) : [];
    const parsedTextes = textes ? JSON.parse(textes) : [];

    const pdfs = req.files['pdfs']?.map((file, i) => ({
      filename: file.filename,
      description: parsedPdfDescriptions[i] || ''
    })) || [];

    const images = req.files['images']?.map((file, i) => ({
      filename: file.filename,
      comment: parsedImageDescriptions[i] || ''
    })) || [];

    const videos = req.files['video']?.map((file) => ({
      filename: file.filename,
      comment: commentaireVideo || ''
    })) || [];

    const newCourse = new Course({
      titre,
      description,
      nomProf,
      textes: parsedTextes, // ✅ ajout des textes
      pdfs,
      images,
      video: videos
    });

    await newCourse.save();

    const users = await User.find({ role: 'etudiant' });

    for (const user of users) {
      const message = `Un nouveau cours "${titre}" a été publié sur la plateforme.`;
      try {
        await envoyerMessageParEmail(user.email, message);
      } catch (err) {
        console.warn(`❌ Échec de l’envoi à ${user.email} :`, err.message);
      }
    }

    res.status(201).json({ message: 'Cours enregistré avec succès et notifications envoyées !' });

  } catch (err) {
    console.error('Erreur createCourse :', err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement du cours" });
  }
};

// 📚 Obtenir tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error('Erreur getAllCourses :', err);
    res.status(500).json({ message: "Erreur lors de la récupération des cours." });
  }
};

// 🔍 Rechercher un cours par titre
exports.searchCourseByTitle = async (req, res) => {
  let titre = req.query.titre;

  if (!titre) {
    return res.status(400).json({ message: "Le paramètre 'titre' est requis." });
  }

  titre = titre.trim();

  // ⛑️ On échappe les caractères spéciaux pour éviter les erreurs RegExp
  const escapedTitre = escapeRegex(titre);
  const regex = new RegExp(`^${escapedTitre}$`, 'i');

  try {
    const courses = await Course.find({ titre: regex });

    if (courses.length === 0) {
      return res.status(404).json({ message: "Aucun cours trouvé avec ce titre." });
    }

    res.status(200).json(courses);
  } catch (err) {
    console.error('Erreur searchCourseByTitle :', err);
    res.status(500).json({ message: "Erreur lors de la recherche de cours." });
  }
};

// 🔧 Fonction à placer soit dans le même fichier soit extraire dans un util.js
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.json(course);
  } catch (error) {
    console.error("Erreur getCourseById:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};