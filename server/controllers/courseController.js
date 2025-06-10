const Course = require('../models/Course');
const User = require('../models/User');
const { envoyerMessageParEmail } = require('../email/gestionemail');
const mongoose = require('mongoose');

// 📥 Ajouter un nouveau cours
exports.createCourse = async (req, res) => {
  try {
    const {
      titre,
      description,
      emailProf,
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
      emailProf,
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
  }catch (err) {
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
exports.getCourseByIdRaw = async (id) => {
  try {
    const course = await Course.findById(id);
    return course;
  } catch (error) {
    console.error("Erreur getCourseByIdRaw:", error);
    return null;
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // ✅ Vérification ID valide
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "ID de cours invalide." });
    }

    const {
      titre,
      description,
      emailProf,
      pdfDescriptions,
      imageDescriptions,
      commentaireVideo,
      textes
    } = req.body;

    // ✅ Parsing JSON sécurisé
    let parsedPdfDescriptions = [];
    let parsedImageDescriptions = [];
    let parsedTextes = [];

    try {
      parsedPdfDescriptions = pdfDescriptions ? JSON.parse(pdfDescriptions) : [];
    } catch (err) {
      return res.status(400).json({ message: "Descriptions PDF mal formatées." });
    }

    try {
      parsedImageDescriptions = imageDescriptions ? JSON.parse(imageDescriptions) : [];
    } catch (err) {
      return res.status(400).json({ message: "Descriptions d'images mal formatées." });
    }

    try {
      parsedTextes = textes ? JSON.parse(textes) : [];
    } catch (err) {
      return res.status(400).json({ message: "Textes mal formatés." });
    }

    // 🔍 Récupération du cours
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé." });
    }

    // 🧩 Mise à jour des champs simples
    if (titre) course.titre = titre;
    if (description) course.description = description;
    if (emailProf) course.emailProf = emailProf;
    if (parsedTextes.length > 0) course.textes = parsedTextes;

    // 📂 Ajout de nouveaux fichiers
    if (req.files) {
      if (req.files['pdfs']) {
        const newPdfs = req.files['pdfs'].map((file, i) => ({
          filename: file.filename,
          description: parsedPdfDescriptions[i] || ''
        }));
        course.pdfs.push(...newPdfs);
      }

      if (req.files['images']) {
        const newImages = req.files['images'].map((file, i) => ({
          filename: file.filename,
          comment: parsedImageDescriptions[i] || ''
        }));
        course.images.push(...newImages);
      }

      if (req.files['video']) {
        const newVideos = req.files['video'].map(file => ({
          filename: file.filename,
          comment: commentaireVideo || ''
        }));
        course.video.push(...newVideos);
      }
    }

    // 💾 Sauvegarde finale
    await course.save();

    // 📧 Notification étudiants
    const users = await User.find({ role: 'etudiant' });
    for (const user of users) {
      const message = `Le cours "${course.titre}" a été mis à jour. Vérifiez les nouvelles ressources !`;
      try {
        await envoyerMessageParEmail(user.email, message);
      } catch (err) {
        console.warn(`❌ Email non envoyé à ${user.email}:`, err.message);
      }
    }

    res.status(200).json({ message: "Cours mis à jour avec succès.", course });

  } catch (error) {
    console.error("Erreur updateCourse :", error.stack || error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du cours." });
  }
};

// ➕ Ajouter une note étoile
exports.rateCourse = async (req, res) => {
  const { courseId, rating } = req.body;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    const existingRating = course.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      return res.status(400).json({ message: "Vous avez déjà noté ce cours" });
    }

    course.ratings.push({ userId, rating });
    await course.save();

    res.status(200).json({ message: "Note enregistrée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l’enregistrement de la note", error: err });
  }
};

// 🔢 Obtenir la moyenne des étoiles
exports.getCourseAverageRating = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    const ratings = course.ratings;
    const total = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = ratings.length ? total / ratings.length : 0;

    res.status(200).json({ average, count: ratings.length });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du calcul de la moyenne", error: err });
  }
};

// 1. Nombre de cours créés par professeur
exports.getCoursesCountByProf = async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $group: {
          _id: '$emailProf',  // On groupe par email du prof
          totalCourses: { $sum: 1 }
        }
      },
      { $sort: { totalCourses: -1 } }
    ]);
    res.json(result.map(item => ({ prof: item._id, totalCourses: item.totalCourses })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur récupération nombre cours par prof' });
  }
};

// 2. Top des meilleurs cours par moyenne rating
exports.getTopCoursesByRating = async (req, res) => {
  try {
    const courses = await Course.find();

    const formatted = courses.map(c => {
      const total = c.ratings.reduce((sum, r) => sum + r.rating, 0);
      const avg = c.ratings.length ? total / c.ratings.length : 0;
      return {
        cours: c.titre,
        moyenne: Number(avg.toFixed(2))
      };
    });

    // Tri décroissant par moyenne
    formatted.sort((a, b) => b.moyenne - a.moyenne);

    // Renvoie les top 5 (ou moins)
    res.json(formatted.slice(0, 5));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur récupération top cours' });
  }
};
