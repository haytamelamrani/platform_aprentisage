// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware principal : vérifie que le token JWT est présent et valide
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // id, role, etc. disponibles dans req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour restreindre l'accès aux admins uniquement
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
};

// Middleware pour restreindre l'accès aux professeurs uniquement
const isProfesseur = (req, res, next) => {
  if (req.user.role !== 'professeur') {
    return res.status(403).json({ message: 'Accès réservé aux professeurs.' });
  }
  next();
};

// Middleware pour restreindre l'accès aux étudiants uniquement
const isEtudiant = (req, res, next) => {
  if (req.user.role !== 'etudiant') {
    return res.status(403).json({ message: 'Accès réservé aux étudiants.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  isAdmin,
  isProfesseur,
  isEtudiant,
};
