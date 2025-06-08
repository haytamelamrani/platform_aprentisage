const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { enregistrerLog } = require('../utils/logUtils');
const { envoyerCodeParEmail, envoyerMessageParEmail } = require('../email/gestionemail');

let code = '';
const tempuser = new Map();

function generateNumericCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// 🔐 Inscription
exports.register = async (req, res) => {
  try {
    const { nom, prenom, niveauEtude, niveauProg, email, motdepasse, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    code = generateNumericCode(6);
    await envoyerCodeParEmail(email, code);

    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    tempuser.set('cles', { nom, prenom, niveauEtude, niveauProg, email, motdepasse: hashedPassword, role });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// 🔑 Vérification du code OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userData = tempuser.get('cles');

    if (otp !== code) {
      return res.status(400).json({ message: '❌ Code OTP invalide ou expiré.' });
    }

    const user = new User(userData);
    await user.save();
    tempuser.delete('cles');

    res.status(200).json({ message: '✅ Code OTP vérifié, compte activé.' });
  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur lors de la vérification du code OTP.', error: error.message });
  }
};

// 🔐 Connexion
exports.login = async (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      await enregistrerLog({
        email,
        role: 'unknown',
        action: 'failed_login',
        ip: req.ip
      });
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!isMatch) {
      await enregistrerLog({
        userId: user._id,
        email,
        role: user.role,
        action: 'failed_login',
        ip: req.ip
      });
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Enregistrer le login
    await enregistrerLog({
      userId: user._id,
      email: user.email,
      role: user.role,
      action: 'login',
      ip: req.ip
    });

    res.json({ token, user: { id: user._id, nom: user.nom, prenom: user.prenom, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// 🚪 Déconnexion
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Utilise lastLogin stocké en base ou remplace par logique adaptée
    const loginTime = user.lastLogin || new Date();
    const logoutTime = new Date();
    const duration = Math.round((logoutTime - loginTime) / 60000);

    await enregistrerLog({
      userId,
      email: user.email,
      role: user.role,
      action: 'logout',
      ip: req.ip,
      duration
    });


    res.status(200).json({ message: 'Déconnexion réussie', duration });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
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
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await envoyerMessageParEmail(email, `Voici votre lien pour réinitialiser le mot de passe : ${resetLink}`);

    res.status(200).json({ message: "Lien de réinitialisation envoyé avec succès." });
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

    user.motdepasse = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "✅ Mot de passe mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "❌ Erreur serveur." });
  }
};

// 🔍 Obtenir un utilisateur par email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    res.json({ nom: user.nom, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 📈 Statistiques : inscriptions par mois
exports.getMonthlyRegistrations = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const formatted = result.map(r => ({ mois: mois[r._id - 1], total: r.total }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Erreur statistiques." });
  }
};

// 📊 Répartition des utilisateurs
exports.getRepartitionUsers = async (req, res) => {
  try {
    const etude = await User.aggregate([
      { $match: { role: 'etudiant' } },
      { $group: { _id: "$niveauEtude", count: { $sum: 1 } } }
    ]);

    const prog = await User.aggregate([
      { $match: { role: 'etudiant' } },
      { $group: { _id: "$niveauProg", count: { $sum: 1 } } }
    ]);

    res.json({ niveauEtude: etude, niveauProg: prog });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des données." });
  }
};
