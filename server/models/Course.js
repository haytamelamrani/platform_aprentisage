const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titre: String,
  description: String,
  pdfs: [
    {
      filename: String, // ✅ plus besoin de fileId
      description: String
    }
  ],
  images: [
    {
      filename: String,
      comment: String
    }
  ],
  video: {
    filename: String,
    comment: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
