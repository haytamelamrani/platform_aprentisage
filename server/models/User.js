const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
  role: {
    type: String,
    enum: ['etudiant', 'professeur', 'admin'],
    default: 'etudiant'
  },
  niveauEtude:{ type: String},
  niveauProg:{ type: String},
  resetToken: String,
  resetTokenExpire: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
