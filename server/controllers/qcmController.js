const mongoose = require('mongoose');
const Qcm = require('../models/Qcm');

// ✅ Enregistrement de plusieurs QCMs liés à un cours
exports.addMultipleQcm = async (req, res) => {
  const { courseId, questions } = req.body;

  if (!courseId || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Données invalides.' });
  }

  try {
    const savedQcms = await Promise.all(
      questions.map(async (q) => {
        const newQcm = new Qcm({
          course: new mongoose.Types.ObjectId(courseId),
          question: q.question,
          correctAnswer: q.correctAnswer,
          wrongAnswers: q.wrongAnswers
        });
        return await newQcm.save();
      })
    );

    res.status(201).json({
      message: 'QCMs enregistrés avec succès.',
      data: savedQcms
    });
  } catch (error) {
    console.error('❌ Erreur lors de l’enregistrement des QCMs :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ✅ Récupération des QCMs par ID du cours depuis l’URL
exports.getQcmByCourse = async (req, res) => {
  const { idcour } = req.params;

  try {
    const objectId = new mongoose.Types.ObjectId(idcour);
    const qcms = await Qcm.find({ course: objectId });

    if (!qcms.length) {
      return res.status(404).json({ message: 'Aucun QCM trouvé pour ce cours.' });
    }

    res.status(200).json({ qcms });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des QCMs :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
