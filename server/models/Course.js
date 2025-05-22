const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  nomProf: String,
  fichiers: {
    pdfs: [String],
    images: [String],
    videos: [String],
    textes: [String],
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
