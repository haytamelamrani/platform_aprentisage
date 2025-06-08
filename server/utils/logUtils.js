const Log = require('../models/Log');

exports.enregistrerLog = async ({ userId, email, role, action, ip, duration }) => {
  try {
    await Log.create({
      userId,
      email,
      role,
      action,
      ip,
      duration,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du log:", err);
  }
};
