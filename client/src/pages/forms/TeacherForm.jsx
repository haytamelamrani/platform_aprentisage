import React from 'react';

const TeacherForm = () => {
  return (
    <form className="form">
      <h3>Inscription Professeur</h3>
      <input type="text" placeholder="Nom" required />
      <input type="text" placeholder="Prénom" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Mot de passe" required />
      <input type="text" placeholder="Compétence principale" required />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default TeacherForm;
