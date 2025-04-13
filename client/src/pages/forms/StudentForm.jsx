import React from 'react';

const StudentForm = () => {
  return (
    <form className="form">
      <h3>Inscription Étudiant</h3>
      <input type="text" placeholder="Nom" required />
      <input type="text" placeholder="Prénom" required />
      <input type="date" placeholder="Date de naissance" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Mot de passe" required />
      <select required>
        <option value="">Niveau d'étude</option>
        <option value="Licence">Licence</option>
        <option value="Master">Master</option>
        <option value="Doctorat">Doctorat</option>
      </select>
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default StudentForm;
