const express = require('express');
const axios = require('axios');
const router = express.Router();
const Course = require('../models/Course');
const { getCourseByIdRaw } = require('../controllers/courseController'); // importe ici

router.post('/', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Aucune question reçue.' });

  const questionFormatee = question.trim().toLowerCase();

  try {
    const coursDisponibles = await Course.find({}, 'titre');

    const coursTrouve = coursDisponibles.find(c =>
      questionFormatee.includes(c.titre.toLowerCase())
    );

    if (coursTrouve) {
      // 🧠 utilise la fonction controller
      const course = await getCourseByIdRaw(coursTrouve._id);
      if (course) {
        const lien = `http://localhost:3000/Prof/courses/${course.titre}`;
        return res.json({
          reponse: `📘 **${course.titre}**\n\n${course.description}\n\n📄 PDFs : ${course.pdfs.length}\n🖼️ Images : ${course.images.length}\n📝 Textes : ${course.textes.length}`,
          lien: `http://localhost:3000/Prof/courses/${encodeURIComponent(course.titre)}`
        });
        
      } else {
        return res.status(404).json({ reponse: "Cours non trouvé." });
      }
    }

    // Appel IA si aucun cours trouvé
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/hermes-2-pro-llama-3-8b',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA pour aider les étudiants à comprendre la programmation.'
          },
          {
            role: 'user',
            content: question
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'SmartLearn Assistant'
        }
      }
    );

    const message = response.data.choices[0].message.content;
    res.json({ reponse: message });

  } catch (error) {
    console.error('Erreur chatbot:', error.message);
    res.status(500).json({ error: "Erreur côté serveur ou OpenRouter." });
  }
});

module.exports = router;
