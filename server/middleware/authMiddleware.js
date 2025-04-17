const jwt = require('jsonwebtoken');

// ✅ Middleware principal : vérifie si le token JWT est présent et valide
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Ajoute les infos du token (id, role...) à req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// ✅ Middleware : Vérifie si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
};

// ✅ Middleware : Vérifie si l'utilisateur est professeur
const isProfesseur = (req, res, next) => {
  if (req.user.role !== 'professeur') {
    return res.status(403).json({ message: 'Accès réservé aux professeurs.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  isAdmin,
  isProfesseur
};