const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statut: { 
    type: String, 
    enum: ['accepte'], 
    default: 'accepte' 
  },
  fichiers: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
