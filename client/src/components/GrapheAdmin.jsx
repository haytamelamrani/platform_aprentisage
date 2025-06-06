import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const GrapheAdmin = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [temps, setTemps] = useState([]);
  const [bestScores, setBestScores] = useState([]);
  const [coursesByProf, setCoursesByProf] = useState([]);
  const [topCoursesRating, setTopCoursesRating] = useState([]);
  const [niveauEtudeData, setNiveauEtudeData] = useState([]);
  const [niveauProgData, setNiveauProgData] = useState([]);
  

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // objet complet de la donnée (cours, meilleurScore, etudiant)
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>{label}</strong></p>
          <p>Note: {data.meilleurScore}</p>
          <p>Étudiant: {data.etudiant}</p>
        </div>
      );
    }
  
    return null;
  };
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/registrations')
      .then(res => setInscriptions(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/admin/progress')
      .then(res => setProgressions(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/admin/ratings')
      .then(res => setNotes(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/admin/time-spent')
      .then(res => setTemps(res.data))
      .catch(console.error);
    
    axios.get('http://localhost:5000/api/admin/best-scores')
      .then(res => setBestScores(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/admin/courses-by-prof')
      .then(res => setCoursesByProf(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/admin/top-courses-rating')
      .then(res => setTopCoursesRating(res.data))
      .catch(console.error);

      axios.get('http://localhost:5000/api/admin/repartition')
      .then(res => {
        const format = (arr) =>
          arr.map((item) => ({ name: item._id || 'Non défini', value: item.count }));

        setNiveauEtudeData(format(res.data.niveauEtude));
        setNiveauProgData(format(res.data.niveauProg));
      });
  }, []);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0'];
  const colors = {
    inscriptions: "#8884d8",
    progressions: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0"],
    notes: "#f5b301",
    temps: "#00ff88",
    coursesByProf: "#413ea0",
    topCoursesRating: "#ff7300",
    bestScores: "#82ca9d"
  };

  return (
    <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
      <div className="graphiques-container" style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
      <div style={{ width: '400px', height: '300px' }}>
        <h3>🎓 Répartition par Niveau d'Étude</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={niveauEtudeData} dataKey="value" nameKey="name" outerRadius={100}>
              {niveauEtudeData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '400px', height: '300px' }}>
        <h3>📘 Répartition par Niveau de Progression</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={niveauProgData} dataKey="value" nameKey="name" outerRadius={100}>
                {niveauProgData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Inscriptions par mois */}
      <div>
        <h3>📈 Inscriptions par mois</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={inscriptions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke={colors.inscriptions} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      
      {/* Nombre de cours créés par professeur */}
      <div>
        <h3>👨‍🏫 Nombre de cours créés par professeur</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={coursesByProf}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="prof" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="totalCourses" fill={colors.coursesByProf} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 des meilleurs cours par moyenne des notes */}
      <div>
        <h3>🏆 Top 5 des meilleurs cours (étoiles moyennes)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topCoursesRating}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cours" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="moyenne" fill={colors.topCoursesRating} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Meilleures notes par cours */}
      <div>
        <h3>🏅 Meilleures notes par cours (avec étudiant)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bestScores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cours" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="meilleurScore" fill={colors.bestScores} />
          </BarChart>
        </ResponsiveContainer>
      </div>

     
    </div>
  );
};

export default GrapheAdmin;
