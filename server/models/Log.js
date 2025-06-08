const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  role: String,
  action: String, // 'login', 'logout', 'failed_login', 'unauthorized_access'
  timestamp: { type: Date, default: Date.now },
  ip: String,
  duration: Number, // minutes si action = logout
});

module.exports = mongoose.model('Log', logSchema);
