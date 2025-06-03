const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin, isProfesseur } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// 🧠 Récupérer l'utilisateur connecté
router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: 'Bienvenue utilisateur authentifié', user: req.user });
});

// 🔐 Accès réservé à l’admin
router.get('/admin', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Bienvenue admin' });
});

// 👨‍🏫 Accès réservé au professeur
router.get('/prof', authMiddleware, isProfesseur, (req, res) => {
  res.json({ message: 'Bienvenue professeur' });
});





module.exports = router;
