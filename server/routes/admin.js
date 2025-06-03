const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { getMonthlyRegistrations } = require('../controllers/authController');
const {getCoursesCountByProf,getTopCoursesByRating} = require('../controllers/courseController');
const { getBestScoresByCourse } = require('../controllers/progressController');



// 🔹 Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔹 Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// 🔹 Modifier le rôle d’un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
  }
});

// 🔹 Récupérer tous les cours
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
  }
});

// 🔹 Supprimer un cours
router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
  }
});

router.get('/registrations', getMonthlyRegistrations);
router.get('/courses-by-prof', getCoursesCountByProf);
router.get('/top-courses-rating', getTopCoursesByRating);
router.get('/best-scores', getBestScoresByCourse);


module.exports = router;
