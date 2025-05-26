const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  nomProf: String,
  pdfs: [
    {
      filename: String,
      description: String
    }
  ],
  images: [
    {
      filename: String,
      comment: String
    }
  ],
  video: [
    {
      filename: String,
      comment: String
    }
  ],
  textes: [
    {
      contenu: String
    }
  ],
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      stars: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
