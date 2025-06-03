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
    { name: 'video', maxCount: 3 }
  ]),
  courseController.createCourse
);

// 📚 Récupérer tous les cours
router.get('/all', courseController.getAllCourses);

// 🔍 Rechercher un cours par titre (via query param ?titre=...)
router.get('/search', courseController.searchCourseByTitle);

// 🆕 ✅ Récupérer un cours par son ID
router.get('/:id', courseController.getCourseById);

router.put('/:id', upload.fields([
  { name: 'pdfs' }, { name: 'images' }, { name: 'video' }
]), courseController.updateCourse);

router.post('/rate', authMiddleware, courseController.rateCourse);
router.get('/:courseId/average-rating', courseController.getCourseAverageRating);







module.exports = router;