  import React, { useEffect, useState } from 'react';
  import { Navigate } from 'react-router-dom';
  import axios from 'axios';
  import '../styles/SecurityLogsPage.css';
  import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  } from 'recharts';

  const SecurityLogsPage = ({ darkMode }) => {
    const [authorized, setAuthorized] = useState(null);
    const [logs, setLogs] = useState([]);
    const [durations, setDurations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const role = localStorage.getItem('userRole');
      setAuthorized(role === 'admin');
    }, []);

    useEffect(() => {
      if (!authorized) return;

      const fetchData = async () => {
        try {
          const [logsRes, durationsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/logs/security'),
            axios.get('http://localhost:5000/api/logs/durations'),
          ]);
          setLogs(logsRes.data);
          setDurations(durationsRes.data);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [authorized]);

    if (authorized === null) return null;
    if (!authorized) return <Navigate to="/login" replace />;

    if (loading) return <div className={`loading ${darkMode ? 'loading-dark' : 'loading-light'}`}>Chargement en cours...</div>;

    return (
      <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2>Logs de sécurité </h2>
        {logs.length === 0 ? (
          <p>Aucun log de sécurité trouvé.</p>
        ) : (
          <table className={`table ${darkMode ? 'table-dark' : 'table-light'}`} aria-label="Tableau des logs de sécurité">
            <thead>
              <tr>
                <th>Email</th>
                <th>Action</th>
                <th>Date</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{log.email || 'N/A'}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.ip || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Durée totale de connexion par utilisateur (minutes)</h2>
        {durations.length === 0 ? (
          <p>Aucune donnée de durée trouvée.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={durations}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#555' : '#ccc'} />
              <XAxis dataKey="_id" stroke={darkMode ? '#ddd' : '#000'} />
              <YAxis stroke={darkMode ? '#ddd' : '#000'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#eee' : '#000' }} />
              <Legend wrapperStyle={{ color: darkMode ? '#ddd' : '#000' }} />
              <Bar dataKey="totalMinutes" name="Minutes totales" fill={darkMode ? '#82ca9d' : '#3f51b5'} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  };

  export default SecurityLogsPage;
