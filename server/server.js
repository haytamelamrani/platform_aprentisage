const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');
const qcmRoutes = require('./routes/qcm');



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Servir les fichiers statiques (PDF, images, vidéos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/qcm', qcmRoutes);

// ✅ Route d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur la plateforme d’apprentissage !');
});

// ✅ Route 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
