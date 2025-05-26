import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ListeUtilisateurs.css';

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedRoles, setEditedRoles] = useState({}); // 🆕

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

  return (
    <div className="utilisateurs-container">
      <h2>👥 Liste des Utilisateurs</h2>

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
            {users.map(user => {
              const currentEditedRole = editedRoles[user._id] || user.role;
              return (
                <tr key={user._id}>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={currentEditedRole}
                      onChange={(e) => handleSelectChange(user._id, e.target.value)}
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="professeur">Professeur</option>
                      <option value="admin">Admin</option>
                    </select>
                    {currentEditedRole !== user.role && (
                      <button
                        className="edit-btn"
                        onClick={() => applyRoleChange(user._id)}
                      >
                        Modifier
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteUser(user._id)}>
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
