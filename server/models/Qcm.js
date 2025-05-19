const mongoose = require('mongoose');

const qcmSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  wrongAnswers: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Qcm', qcmSchema);
