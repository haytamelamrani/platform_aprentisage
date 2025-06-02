// ⭐ Composant React pour permettre à l'étudiant de donner une note étoilée
import React, { useState } from 'react';
import axios from 'axios';

const RatingStars = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // Assure-toi de stocker le JWT au login

  const handleRating = async (value) => {
    setRating(value);

    try {
      const res = await axios.post('http://localhost:5000/api/courses/rate',
        { courseId, rating: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSubmitted(true);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de l’envoi');
    }
  };

  return (
    <div>
      <h3>Notez ce cours :</h3>
      {[1, 2, 3, 4, 5].map((val) => (
        <span
          key={val}
          style={{
            fontSize: '2rem',
            cursor: submitted ? 'not-allowed' : 'pointer',
            color: val <= rating ? '#f5b301' : '#ccc'
          }}
          onClick={() => !submitted && handleRating(val)}
        >
          ★
        </span>
      ))}

      {message && <p style={{ marginTop: '10px', color: submitted ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default RatingStars;
