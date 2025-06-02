const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  emailProf: String,

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

  // ⭐ Ajout du champ ratings
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
