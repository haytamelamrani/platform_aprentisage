const multer = require('multer');
const path = require('path');

// 📂 Configuration du stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ✅ dossier de destination
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName); // ✅ nom de fichier unique
  }
});

const upload = multer({ storage });
module.exports = { upload };
