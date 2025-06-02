import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AverageStars = ({ courseId }) => {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}/average-rating`);
        setAverage(res.data.average);
        setCount(res.data.count);
      } catch (err) {
        console.error("Erreur moyenne des notes :", err);
      }
    };
    fetchAverage();
  }, [courseId]);

  return (
    <div >
      <div>
        {[1, 2, 3, 4, 5].map(val => (
          <span key={val} style={{ fontSize: '1.5rem', color: val <= Math.round(average) ? '#f5b301' : '#ccc' }}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default AverageStars;
