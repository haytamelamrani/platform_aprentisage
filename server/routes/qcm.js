const express = require('express');
const router = express.Router();
const qcmController = require('../controllers/qcmController');
const { authMiddleware } = require('../middleware/authMiddleware');

// ✅ Route pour enregistrer plusieurs QCMs (protégée)
router.post('/add-multiple', authMiddleware, qcmController.addMultipleQcm);

// ✅ Route pour récupérer les QCMs d’un cours
router.get('/:idcour', qcmController.getQcmByCourse);

module.exports = router;
