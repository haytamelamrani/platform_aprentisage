import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const StudentFeedback = ({ courseId }) => {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.post(`http://localhost:5000/api/courses/${courseId}/feedback`, {
        note,
        commentaire,
        userId
      });
      setMessage(res.data.message);
      setNote(5);
      setCommentaire("");
    } catch (error) {
      setMessage("❌ Erreur lors de l'envoi du feedback.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: "1rem",
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h4>📝 Laissez un Avis</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Note :
          <select value={note} onChange={(e) => setNote(e.target.value)} style={{ marginLeft: "0.5rem", padding: "0.25rem" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <textarea
          placeholder="Votre commentaire"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          required
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          style={{
            padding: "0.5rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Envoyer le feedback
        </motion.button>
        {message && <p style={{ marginTop: "0.5rem", color: message.startsWith("❌") ? "red" : "green" }}>{message}</p>}
      </form>
    </motion.div>
  );
};

export default StudentFeedback;
