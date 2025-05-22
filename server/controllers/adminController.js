const User = require('../models/User');
const Course = require('../models/Course');
const Message = require('../models/Message'); // adapte si tu utilises Feedback

// Renvoyer les stats globales
const getStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: 'etudiant' });
    const teachers = await User.countDocuments({ role: 'professeur' });
    const courses = await Course.countDocuments();
    const messages = await Message.countDocuments();

    res.status(200).json({ students, teachers, courses, messages });
  } catch (error) {
    console.error('Erreur stats :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getStats };
