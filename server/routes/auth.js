const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔐 Authentification
router.post('/register', authController.register);
router.post('/login', authController.login);

// 🔁 Mot de passe oublié
router.post('/forgot-password', authController.forgotPassword);

// 🔄 Réinitialisation de mot de passe
router.post('/reset-password/:token', authController.resetPassword);

// ✅ Vérification OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
