const Message = require('../models/Message');
const User = require('../models/User');
const Course = require('../models/Course');
const {envoyerMessageParEmail } = require('../email/gestionemail');

exports.sendMessage = async (req, res) => {
  const { courseTitle, content, senderEmail } = req.body;

  try {
    // 1. Trouver le cours par titre
    const course = await Course.findOne({ titre: courseTitle });
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    // 2. Créer et enregistrer le message
    const message = new Message({
      from: senderEmail,
      to: course.emailProf,
      content,
    });

    // 3. Envoyer un email au professeur
    const mesg = `Une question de l'étudiant "${senderEmail}" : "${content}"`;
    try {
      await envoyerMessageParEmail(course.emailProf, mesg);
    } catch (err) {
      console.warn(`❌ Échec de l’envoi à ${course.emailProf} :`, err.message);
    }

    await message.save();
    res.status(200).json({ message: "✅ Message envoyé avec succès" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};


exports.getMessagesForProf = async (req, res) => {
    const { email } = req.params;
  
    try {
      const messages = await Message.find({ to: email }).sort({ date: -1 });
      res.status(200).json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des messages" });
    }
  };

  exports.getAllMessages = async (req, res) => {
    try {
      const messages = await Message.find().sort({ date: -1 });
      res.status(200).json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération de tous les messages" });
    }
  };
  
  exports.deleteMessage = async (req, res) => {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Message supprimé avec succès" });
    } catch (err) {
      console.error("Erreur suppression :", err);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  };
  