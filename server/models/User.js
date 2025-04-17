const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
  role: {
    type: String,
    enum: ['etudiant', 'professeur', 'admin'],
    default: 'etudiant'
  },
  resetToken: { type: String },
  resetTokenExpire: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);