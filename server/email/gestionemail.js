// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

const nodemailer = require('nodemailer');

function envoyerCodeParEmail(destinataire, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // Utilise la variable d'environnement pour l'email
      pass: process.env.EMAIL_PASSWORD // Utilise la variable d'environnement pour le mot de passe
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,   // Utilise la variable d'environnement pour l'email
    to: destinataire,
    subject: 'Code de vérification',
    text: `Bonjour, \nPour accéder à Smart Learn, voici votre code de vérification: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l’envoi :', error);
    } else {
      console.log('Email envoyé :', info.response, 'Code :', code);
    }
  });
}

module.exports = envoyerCodeParEmail;
