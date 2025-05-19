const express = require('express');
const courseController = require('../controllers/courseController'); // ✅ import complet
const { upload } = require('../middleware/upload');
const { authMiddleware, isProfesseur } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 Route pour ajouter un cours (professeur seulement)
router.post(
  '/add',
  authMiddleware,
  isProfesseur,
  upload.fields([
    { name: 'pdfs', maxCount: 10 },
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 }
  ]),
  courseController.createCourse
);

// 📚 Route pour récupérer tous les cours
router.get('/all', courseController.getAllCourses);

// 🔍 Route pour chercher un cours par titre
router.get('/search', courseController.searchCourseByTitle);

module.exports = router;
