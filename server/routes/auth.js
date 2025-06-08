const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Import du middleware

// 🔐 Authentification
router.post('/register', authController.register);
router.post('/login', authController.login);

// 🔁 Mot de passe oublié
router.post('/forgot-password', authController.forgotPassword);

// 🔄 Réinitialisation de mot de passe
router.post('/reset-password/:token', authController.resetPassword);

// ✅ Vérification OTP
router.post('/verify-otp', authController.verifyOtp);

// 🚪 Déconnexion protégée (token obligatoire)
router.post('/logout', authMiddleware, authController.logout);

// 📌 Obtenir un utilisateur par email
router.get('/:email', authController.getUserByEmail);

module.exports = router;
