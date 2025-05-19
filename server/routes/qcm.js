const express = require('express');
const router = express.Router();
const qcmController = require('../controllers/qcmController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route pour enregistrer plusieurs QCM
router.post('/add-multiple', authMiddleware, qcmController.addMultipleQcm);

module.exports = router;
