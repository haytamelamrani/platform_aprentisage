const Progress = require('../models/Progress');

// 🔹 Enregistrer ou mettre à jour la progression
const saveProgress = async (req, res) => {
  const { email, nomCours, score, total } = req.body;

  if (!email || !nomCours || score == null || total == null) {
    return res.status(400).json({ message: 'Champs manquants.' });
  }

  const pourcentage = Math.round((score / total) * 100);

  try {
    let progress = await Progress.findById(email);

    const newEntry = {
      nomCours,
      score,
      total,
      pourcentage,
      date: new Date(),
    };

    if (!progress) {
      progress = new Progress({
        _id: email,
        scores: [newEntry],
      });
    } else {
      progress.scores.push(newEntry);
    }

    await progress.save();
    res.status(200).json({ message: 'Progression enregistrée avec succès.', progress });

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement.', error });
  }
};

// 🔹 Récupérer tous les progrès
const getAllProgress = async (req, res) => {
  try {
    const progresses = await Progress.find();
    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération.', error });
  }
};

// 🔹 Récupérer le progrès par email
const getProgressByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const progress = await Progress.findById(email);
    if (!progress) {
      return res.status(404).json({ message: 'Aucun progrès trouvé pour cet email.' });
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération.', error });
  }
};

module.exports = {
  saveProgress,
  getAllProgress,
  getProgressByEmail,
};
