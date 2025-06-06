import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ListeUtilisateurs.css';

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedRoles, setEditedRoles] = useState({}); // 🆕
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('email');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("❌ Erreur suppression :", error);
    }
  };

  const handleSelectChange = (id, newRole) => {
    setEditedRoles(prev => ({ ...prev, [id]: newRole }));
  };

  const applyRoleChange = async (id) => {
    try {
      const role = editedRoles[id];
      if (!role) return;

      await axios.put(`http://localhost:5000/api/admin/users/${id}`, { role });
      setEditedRoles(prev => ({ ...prev, [id]: undefined }));
      fetchUsers();
    } catch (error) {
      console.error("❌ Erreur modification rôle :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const filteredResults = users.filter(res => {
    const term = searchTerm.toLowerCase();
  
    if (filterType === 'email') {
      return res.email.toLowerCase().includes(term);
    } else if (filterType === 'etudiant') {
      return res.role.toLowerCase() === 'etudiant';
    } else if (filterType === 'prof') {
      return res.role.toLowerCase() === 'professeur';
    } else {
      return res.nom.toLowerCase().includes(term);
    }
  });
  
  return (
    <div className="utilisateurs-container">
      <h2>👥 Liste des Utilisateurs</h2>
      <div className="search-bar">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="email">🔍 Par email</option>
          <option value="nom">🔍 Par nom</option>
          <option value="etudiant">🔍 tout les etudiant</option>
          <option value="prof">🔍 tout les prof</option>
        </select>
        <input
          type="text"
          placeholder={`Rechercher par ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((res, i) => {
              const currentEditedRole = editedRoles[res._id] || res.role;
              return (
                <tr key={res._id}>
                  <td>{res.nom}</td>
                  <td>{res.email}</td>
                  <td>
                    <select
                      value={currentEditedRole}
                      onChange={(e) => handleSelectChange(res._id, e.target.value)}
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="professeur">Professeur</option>
                      <option value="admin">Admin</option>
                    </select>
                    {currentEditedRole !== res.role && (
                      <button
                        className="edit-btn"
                        onClick={() => applyRoleChange(res._id)}
                      >
                        Modifier
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteUser(res._id)}>
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeUtilisateurs;
