const express = require('express');
const router = express.Router();

const {
  saveProgress,
  getAllProgress,
  getProgressByEmail
} = require('../controllers/progressController');

// 🔹 Enregistrer une progression (POST /api/progress/save)
router.post('/save', saveProgress);

// 🔹 Récupérer toutes les progressions (GET /api/progress)
router.get('/', getAllProgress);

// 🔹 Récupérer les scores d'un utilisateur par email (GET /api/progress/:email)
router.get('/:email', getProgressByEmail);

module.exports = router;
