const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const envoyerCodeParEmail = require('../email/gestionemail');
let code = generateNumericCode(6);
function generateNumericCode(length = 6) {
  let code = '';
  let num = 0;
  for (let i = 0; i < length; i++) {
    num = Math.floor(Math.random() * 10); 
    code += ''+num;
  }
  return code;
};

// 🔐 Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, motdepasse, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });
    code = generateNumericCode(6);
    envoyerCodeParEmail(email,code); 
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const newUser = new User({ nom, email, motdepasse: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
// 🔑 Vérification du code OTP

exports.verifyOtp = async (req, res) => {
  let cp=0;
  try {
    const { otp } = req.body;

    // Vérifier si l'OTP envoyé par l'utilisateur correspond au code généré
    if (otp !== code) {
      return res.status(400).json({ message: '❌ Code OTP invalide ou expiré.' });
    }
    res.status(200).json({ message: '✅ Code OTP vérifié, compte activé.' });
  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur lors de la vérification du code OTP.', error: error.message });
  }
}


// 🔐 Connexion
exports.login = async (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: user._id, nom: user.nom, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// 🔄 Mot de passe oublié
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email introuvable." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetLink =` http://localhost:3000/reset-password/${resetToken}`;
    console.log("🔗 Lien de réinitialisation :", resetLink);

    res.status(200).json({ message: "Lien de réinitialisation généré avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔐 Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.motdepasse = hashed;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "✅ Mot de passe mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "❌ Erreur serveur." });
  }
};

// 🔁 Changer le mot de passe depuis profil connecté
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    const isMatch = await bcrypt.compare(currentPassword, user.motdepasse);
    if (!isMatch) return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.motdepasse = hashed;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.updateProfile = async (req, res) => {
  const { nom, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    if (nom) user.nom = nom;
    if (email) user.email = email;
    await user.save();

    res.json({ message: 'Profil mis à jour avec succès.', user: { nom: user.nom, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};