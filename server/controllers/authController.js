const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { envoyerCodeParEmail, envoyerMessageParEmail } = require('../email/gestionemail');
let code='';

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
    const { nom,prenom,niveauEtude,niveauProg, email, motdepasse, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    code = generateNumericCode(6);
    envoyerCodeParEmail(email, code);

    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    tempuser.set('cles',{ nom,prenom,niveauEtude,niveauProg, email, motdepasse: hashedPassword, role });


    res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier le code envoyé à votre email.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// 🔑 Vérification du code OTP
exports.verifyOtp = async (req, res) => {
  let cp=0;
  try {
    const { otp } = req.body;
    const userData = tempuser.get('cles');

    // Vérifier si l'OTP envoyé par l'utilisateur correspond au code généré
    if (otp !== code) {
      return res.status(400).json({ message: '❌ Code OTP invalide ou expiré.' });
    }
    const user = new User({
      nom: userData.nom,
      prenom: userData.prenom,
      niveauEtude: userData.niveauEtude,
      niveauProg: userData.niveauProg,
      email: userData.email,
      motdepasse: userData.motdepasse,
      role: userData.role
    });
    await user.save();
    tempuser.delete('cles');
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

    res.json({ token, user: { id: user._id, nom: user.nom, role: user.role,prenom: user.prenom } });
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

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Voici votre lien pour modifier votre mot de passe : ${resetLink}`;

    await envoyerMessageParEmail(email, message);
    console.log("🔗 Lien de réinitialisation :", resetLink);

    res.status(200).json({ message: "Lien de réinitialisation généré avec succès." });
  } catch (err) {
    console.error("Erreur dans forgotPassword :", err);
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


// 🔍 Obtenir un utilisateur par email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Tu peux retourner plus ou moins d'infos selon ce que tu veux exposer
    res.json({ nom: user.nom, email: user.email, role: user.role });
  } catch (err) {
    console.error("Erreur getUserByEmail:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getMonthlyRegistrations = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    const formatted = result.map(r => ({
      mois: mois[r._id - 1],
      total: r.total
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erreur getMonthlyRegistrations:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des inscriptions mensuelles" });
  }
};

// 📊 Répartition par niveau d'étude et niveau de progression
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
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des données." });
  }
};
