const Progress = require('../models/Progress');
const User = require('../models/User'); 


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

const getBestScoresByCourse = async (req, res) => {
  try {
    // Récupérer tous les progrès
    const progresses = await Progress.find();

    // Map cours → { maxScore, userEmail }
    const bestScoresMap = {};

    // Parcours de tous les scores pour trouver le max par cours
    for (const progress of progresses) {
      const email = progress._id;
      for (const scoreEntry of progress.scores) {
        const { nomCours, score } = scoreEntry;

        if (!bestScoresMap[nomCours] || score > bestScoresMap[nomCours].score) {
          bestScoresMap[nomCours] = { score, email };
        }
      }
    }

    // Maintenant on récupère les noms utilisateurs correspondants
    const emails = Object.values(bestScoresMap).map(entry => entry.email);
    const users = await User.find({ email: { $in: emails } });

    // Créer un tableau résultat
    const result = Object.entries(bestScoresMap).map(([cours, { score, email }]) => {
      const user = users.find(u => u.email === email);
      return {
        cours,
        meilleurScore: score,
        etudiant: user ? user.nom : email
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Erreur getBestScoresByCourse:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


module.exports = {
  saveProgress,
  getAllProgress,
  getProgressByEmail,
  getBestScoresByCourse
};
