import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TeacherDashboard.css';

const API_BASE_URL = 'http://localhost:5000';

const TeacherDashboard = ({ darkMode }) => {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('email');

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyStates, setReplyStates] = useState({}); // { messageId: "texte" }

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/messages/received/${userEmail}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Erreur chargement messages :", err))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleReplyChange = (index, value) => {
    setReplyStates({ ...replyStates, [index]: value });
  };

  const handleSendReply = async (msg, index) => {
    const reply = replyStates[index];
    if (!reply || reply.trim() === '') return alert("Écrivez une réponse.");
    try {
      await axios.post(`${API_BASE_URL}/api/messages/send`, {
        senderEmail: userEmail,
        content: reply,
        courseTitle: '', // Facultatif si tu veux tracer le cours
        to: msg.from
      });
      alert("Réponse envoyée !");
      setReplyStates({ ...replyStates, [index]: '' });
    } catch (err) {
      console.error(err);
      alert("Erreur d’envoi de la réponse.");
    }
  };

  return (
    <div className={`teacher-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <h2>Bienvenue professeur 👩‍🏫 {userName}</h2>
        <p>Voici votre tableau de bord pour gérer les messages reçus.</p>
        
      </div>

      <div className="messages-section">
        <h3>📩 Messages reçus :</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : messages.length === 0 ? (
          <p>Aucun message reçu pour le moment.</p>
        ) : (
          <ul className="messages-list">
            {messages.map((msg, index) => (
              <li key={index} className="message-card">
                <p><strong>De :</strong> {msg.from}</p>
                <p><strong>Message :</strong> {msg.content}</p>
                <p className="message-date">🕒 {new Date(msg.date).toLocaleString()}</p>

                <textarea
                  placeholder="Votre réponse..."
                  rows={2}
                  value={replyStates[index] || ''}
                  onChange={(e) => handleReplyChange(index, e.target.value)}
                  className="reply-textarea"
                />
                <button onClick={() => handleSendReply(msg, index)} className="reply-button">
                  Envoyer la réponse
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;  
