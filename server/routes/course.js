const express = require('express');
const courseController = require('../controllers/courseController');
const { upload } = require('../middleware/upload');
const { authMiddleware, isProfesseur } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 Ajouter un cours (professeur connecté)
router.post(
  '/add',
  authMiddleware,
  isProfesseur,
  upload.fields([
    { name: 'pdfs', maxCount: 10 },
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 3 }
  ]),
  courseController.createCourse
);

// 📚 Obtenir tous les cours
router.get('/all', courseController.getAllCourses);

// 🔍 Chercher un cours par titre
router.get('/search', courseController.searchCourseByTitle);

// 🧾 Obtenir un cours par ID (pour modification)
if (typeof courseController.getCourseById === 'function') {
  router.get('/:id', courseController.getCourseById);
} else {
  console.warn("⚠️ courseController.getCourseById non défini");
}

// 📝 Modifier un cours
if (typeof courseController.updateCourse === 'function') {
  router.put('/:id', courseController.updateCourse);
} else {
  console.warn("⚠️ courseController.updateCourse non défini");
}

// 🗑️ Supprimer un cours
if (typeof courseController.deleteCourse === 'function') {
  router.delete('/:id', courseController.deleteCourse);
} else {
  console.warn("⚠️ courseController.deleteCourse non défini");
}

module.exports = router;
