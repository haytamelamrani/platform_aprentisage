const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  nomProf: String,

  textes: [
    {
      contenu: { type: String }
    }
  ],
  pdfs: [
    {
      filename: { type: String },
      description: { type: String }
    }
  ],
  images: [
    {
      filename: { type: String },
      comment: { type: String }
    }
  ],
  video: [
    {
      filename: { type: String },
      comment: { type: String }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
