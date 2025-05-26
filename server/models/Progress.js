// models/Progress.js
const mongoose = require('mongoose');

const courseScoreSchema = new mongoose.Schema({
  nomCours: String,
  score: Number,
  total: Number,
  pourcentage: Number,
  date: { type: Date, default: Date.now }
});

const progressSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // _id = email
  scores: [courseScoreSchema]
});

module.exports = mongoose.model('Progress', progressSchema);
