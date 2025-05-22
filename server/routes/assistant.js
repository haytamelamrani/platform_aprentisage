const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Aucune question reçue.' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/hermes-2-pro-llama-3-8b',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA pour aider les étudiants à comprendre la programmation, avec des explications claires et simples.'
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
    console.error('Erreur OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: "Erreur avec OpenRouter ou le modèle IA." });
  }
  console.log('✅ Reponse fournie');

});

module.exports = router;
