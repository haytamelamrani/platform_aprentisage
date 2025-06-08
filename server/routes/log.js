const express = require('express');
const router = express.Router();
const Log = require('../models/Log'); // Assure-toi que ce chemin est correct

// Récupérer les logs de sécurité : failed_login et unauthorized_access
router.get('/security', async (req, res) => {
  try {
    const logs = await Log.find({
      action: { $in: ['failed_login', 'unauthorized_access'] }
    }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Erreur lors de la récupération des logs sécurité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs sécurité.' });
  }
});

// Récupérer la durée totale des sessions par utilisateur (logs logout)
router.get('/durations', async (req, res) => {
  try {
    const durations = await Log.aggregate([
      { $match: { action: 'logout', duration: { $gt: 0 } } },
      {
        $group: {
          _id: '$email',
          totalMinutes: { $sum: '$duration' },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { totalMinutes: -1 } }
    ]);
    res.json(durations);
  } catch (error) {
    console.error('Erreur lors de la récupération des durées:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des durées.' });
  }
});

module.exports = router;
