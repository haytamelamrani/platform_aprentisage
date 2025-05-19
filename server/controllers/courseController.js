const Course = require('../models/Course');
const User = require('../models/User');
const { envoyerMessageParEmail } = require('../email/gestionemail');

// 📥 Ajouter un nouveau cours
exports.createCourse = async (req, res) => {
  try {
    const {
      titre,
      description,
      pdfDescriptions,
      imageDescriptions,
      commentaireVideo
    } = req.body;

    const parsedPdfDescriptions = pdfDescriptions ? JSON.parse(pdfDescriptions) : [];
    const parsedImageDescriptions = imageDescriptions ? JSON.parse(imageDescriptions) : [];

    const pdfs = req.files['pdfs']?.map((file, i) => ({
      filename: file.filename,
      description: parsedPdfDescriptions[i] || ''
    })) || [];

    const images = req.files['images']?.map((file, i) => ({
      filename: file.filename,
      comment: parsedImageDescriptions[i] || ''
    })) || [];

    const videoFile = req.files['video']?.[0];
    const video = videoFile
      ? {
          filename: videoFile.filename,
          comment: commentaireVideo || ''
        }
      : null;

    const newCourse = new Course({
      titre,
      description,
      pdfs,
      images,
      video
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
  const { titre } = req.query;

  if (!titre) {
    return res.status(400).json({ message: "Le paramètre 'titre' est requis." });
  }

  try {
    const courses = await Course.find({
      titre: { $regex: titre, $options: 'i' }
    });

    res.status(200).json(courses);
  } catch (err) {
    console.error('Erreur searchCourseByTitle :', err);
    res.status(500).json({ message: "Erreur lors de la recherche de cours." });
  }
};
