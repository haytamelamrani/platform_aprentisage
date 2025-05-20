const Qcm = require('../models/Qcm');

exports.addMultipleQcm = async (req, res) => {
  const { courseId, questions } = req.body;

  if (!courseId || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Données invalides.' });
  }

  try {
    const savedQcms = await Promise.all(
      questions.map(async (q) => {
        const newQcm = new Qcm({
          course: courseId,
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
    console.error('Erreur lors de l’enregistrement des QCMs :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getQcmByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const qcms = await Qcm.find({ course: courseId });
    if (!qcms.length) {
      return res.status(404).json({ message: 'Aucun QCM trouvé pour ce cours.' });
    }

    res.status(200).json({ qcms });
  } catch (error) {
    console.error('Erreur lors de la récupération des QCMs :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};