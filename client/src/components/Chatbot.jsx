import React, { useState } from 'react';
import '../styles/Chatbot.css';
import aiIcon from '../assets/AI.png';
import userIcon from '../assets/user-icon.png';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const envoyerQuestion = async () => {
    if (!question.trim() || loading) return;

    setMessages([...messages, { sender: 'user', text: question }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: data.reponse || "Je n'ai pas compris." }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "❌ Erreur : l'assistant est momentanément indisponible." }
      ]);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <>
      <button className="chatbot-button" onClick={() => setOpen(!open)}>
        <img src={aiIcon} alt="Assistant IA" className="chatbot-icon" />
      </button>

      {open && (
        <div className="chatbot-box">
          <h4>Assistant IA</h4>

          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <img src={aiIcon} alt="Bot" />}
                <div className="text">
                  {
                  msg.text
                    .split('\n')
                    .slice(0, 10) 
                    .map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                </div>
                {msg.sender === 'user' && <img src={userIcon} alt="User" />}
              </div>
            ))}

            {loading && (
              <div className="message bot">
                <img src={aiIcon} alt="Bot" />
                <div className="text"><p>⏳ L'assistant rédige...</p></div>
              </div>
            )}
          </div>

          <div className="input-area">
            <textarea
              disabled={loading}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={loading ? "Attendez la réponse..." : "Écris ta question ici..."}
            />
            <button onClick={envoyerQuestion} disabled={loading}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
