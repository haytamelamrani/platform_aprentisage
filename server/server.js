const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// 🔹 Charger les variables d’environnement
dotenv.config();

// 🔹 Connexion à la base de données MongoDB
connectDB();

// 🔹 Initialisation de l’application Express
const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Servir les fichiers statiques (PDF, images, vidéos, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Importer et utiliser les routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/qcm', require('./routes/qcm'));
app.use('/api/assistant', require('./routes/assistant'));
app.use('/api/admin', require('./routes/admin'));

app.use('/api/messages', require('./routes/message'));

app.use('/api/progress', require('./routes/progress')); // 🔁 Progression des étudiants

app.use(express.urlencoded({ extended: true }));
// 🔹 Route d’accueil
app.get('/', (req, res) => {
  res.send('🎓 Bienvenue sur la plateforme d’apprentissage !');
});

// 🔹 Gestion des routes inconnues
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route non trouvée' });
});

// 🔹 Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
);