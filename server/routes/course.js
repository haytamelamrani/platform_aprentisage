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

// 📚 Récupérer tous les cours
router.get('/all', courseController.getAllCourses);

// 🔍 Rechercher un cours par titre (via query param ?titre=...)
router.get('/search', courseController.searchCourseByTitle);

// 🧾 Obtenir un cours par ID
router.get('/:id', courseController.getCourseById);

// 📝 Modifier un cours
router.put('/:id', courseController.updateCourse);

// 🗑️ Supprimer un cours
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
