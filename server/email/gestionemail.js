// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

const nodemailer = require('nodemailer');

// Fonction pour envoyer un code de vérification
function envoyerCodeParEmail(destinataire, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinataire,
    subject: 'Code de vérification',
    text: `Bonjour, \nPour accéder à Smart Learn, voici votre code de vérification: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Erreur lors de l’envoi :', error);
    } else {
      console.log('✅ Email envoyé :', info.response,code);
    }
  });
}

// Fonction pour envoyer un message personnalisé
function envoyerMessageParEmail(destinataire, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinataire,
    subject: 'Message de Smart Learn',
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Erreur lors de l’envoi :', error);
    } else {
      console.log('✅ Email envoyé :', info.response);
    }
  });
}

module.exports = {
  envoyerCodeParEmail,
  envoyerMessageParEmail
};
