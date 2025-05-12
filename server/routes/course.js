const express = require('express');
const router = express.Router();
const multer = require('multer');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback'); // ✅ Import du modèle Feedback

// ✅ Configuration de Multer pour stocker dans /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ✅ Voir uniquement les cours acceptés
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ statut: 'accepte' }).populate('auteur', 'nom email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Ajouter un nouveau cours avec fichiers
router.post('/add', upload.array('fichiers'), async (req, res) => {
  const { titre, description, auteur } = req.body;
  const fichiers = req.files.map(file => file.filename);

  console.log('📥 Données reçues pour nouveau cours :', { titre, description, auteur, fichiers });

  try {
    const newCourse = new Course({
      titre,
      description,
      auteur,
      fichiers,
      statut: 'accepte'
    });
    await newCourse.save();
    console.log('✅ Cours enregistré avec succès :', newCourse);
    res.json({ message: 'Cours ajouté et publié ✅', course: newCourse });
  } catch (error) {
    console.error('❌ Erreur lors de l’enregistrement du cours :', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Supprimer un cours
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cours supprimé ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Ajouter un feedback sur un cours
router.post('/:id/feedback', async (req, res) => {
  const { note, commentaire, userId } = req.body;
  const courseId = req.params.id;

  try {
    const feedback = new Feedback({
      course: courseId,
      user: userId,
      note,
      commentaire
    });
    await feedback.save();
    res.json({ message: 'Feedback envoyé ✅', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
