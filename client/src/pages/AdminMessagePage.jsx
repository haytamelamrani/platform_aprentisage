import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminMessagesPage.css';

const API_BASE_URL = 'http://localhost:5000';

const AdminMessagesPage = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    axios.get(`${API_BASE_URL}/api/messages/all`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("Erreur chargement :", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${id}`);
      alert("Message supprimé !");
      fetchMessages(); // Refresh
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className={`admin-messages-page ${darkMode ? 'dark-mode' : ''}`}>
      <h2>📨 Tous les messages</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : messages.length === 0 ? (
        <p>Aucun message.</p>
      ) : (
        <table className="messages-table">
          <thead>
            <tr>
              <th>De</th>
              <th>À</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg._id}>
                <td>{msg.from}</td>
                <td>{msg.to}</td>
                <td>{msg.content}</td>
                <td>{new Date(msg.date).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(msg._id)} className="delete-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMessagesPage;
