import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = ({ darkMode }) => {
  const [userData, setUserData] = useState({ nom: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        toast.error("❌ Erreur lors du chargement du profil");
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nom: userData.nom, email: userData.email })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Profil mis à jour avec succès');
      } else {
        toast.error(data.message || '❌ Erreur lors de la mise à jour');
      }
    } catch (err) {
      toast.error('❌ Erreur serveur');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Mot de passe mis à jour');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(data.message || '❌ Échec du changement de mot de passe');
      }
    } catch (err) {
      toast.error('❌ Erreur serveur');
    }
  };

  if (loading) return <p>Chargement du profil...</p>;

  return (
    <div className={`profile-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="profile-container">
        <h2>Mon profil</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={userData.nom}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="role"
            value={userData.role}
            disabled
            readOnly
          />
          <button type="submit">Mettre à jour</button>
        </form>

        <hr style={{ margin: '30px 0' }} />

        <h3>Changer le mot de passe</h3>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Changer le mot de passe</button>
        </form>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default UserProfile;
