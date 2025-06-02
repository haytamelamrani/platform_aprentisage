const Feedback = require('../models/Feedback');

// ➕ Laisser un avis avec étoiles
exports.createFeedback = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user.id;

    // Vérifie si déjà noté
    const existing = await Feedback.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce cours.' });
    }

    const feedback = new Feedback({ userId, courseId, rating, comment });
    await feedback.save();

    res.status(201).json({ message: 'Avis enregistré', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Erreur enregistrement avis', error });
  }
};

// 📊 Moyenne des notes pour chaque cours
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await Feedback.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $group: {
          _id: '$courseId',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
      }}
    ]);
    res.json(result[0] || { averageRating: 0, totalRatings: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des notes', error });
  }
};
