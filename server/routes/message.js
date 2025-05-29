const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getMessagesForProf,
  getAllMessages,
  deleteMessage
} = require('../controllers/messageController');

// 🔹 Envoyer une question au prof
router.post('/send', sendMessage);

// 🔹 Voir les messages reçus par un prof (via email)
router.get('/received/:email', getMessagesForProf);

// 🔹 Voir tous les messages (admin/debug)
router.get('/all', getAllMessages);

router.delete('/:id', deleteMessage);

module.exports = router;
