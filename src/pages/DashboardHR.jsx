import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/HomePage.module.css';

const HomeHR = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState(localStorage.getItem('organizationId') || '');

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    } else {
      setUserRole('');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [organizationId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userCollection = collection(db, 'Users');
      const userSnapshot = await getDocs(userCollection);
      const allUsers = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const filteredUsers = allUsers
        .filter((user) => (user.role === 'Employee' || user.role === 'HOD') && user.organizationId === organizationId)
        .map((user) => ({
          ...user,
          displayInfo: user.role === 'Employee' ? user.hodName || 'HOD inconnu' : user.department || 'Département inconnu',
        }));

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      toast.error('Échec de la récupération des utilisateurs.');
    }
    setLoading(false);
  };

  const handleLeaveLimitChange = (id, newLimit) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, newLeaveLimit: parseInt(newLimit, 10) || 0 } : user
      )
    );
  };

  const handleSubmit = async (id) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      try {
        const userRef = doc(db, 'Users', id);
        await updateDoc(userRef, { leaveLimit: user.newLeaveLimit });
        toast.success('Limite de congé mise à jour avec succès.');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la limite de congé :', error);
        toast.error('Échec de la mise à jour de la limite de congé.');
      }
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'Users', id));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success('Utilisateur supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      toast.error('Échec de la suppression de l\'utilisateur.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Bienvenue sur le tableau de bord RH</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Rôle</th>
            <th>HOD/Département</th>
            <th>Limite de Congé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={userRole === 'HR Manager' ? '5' : '4'} className={styles.loading}>Chargement...</td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
                <td>{user.displayInfo}</td>
                {user.role === 'Employee' && (
                  <>
                    <td>
                      <input
                        type="number"
                        value={user.newLeaveLimit || user.leaveLimit || ''}
                        onChange={(e) => handleLeaveLimitChange(user.id, e.target.value)}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSubmit(user.id)} className={styles.button}>Soumettre</button>
                    </td>
                  </>
                )}
                {userRole === 'HR Manager' && (
                  <td>
                    <button onClick={() => deleteUser(user.id)} className={styles.button}>Supprimer</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userRole === 'HR Manager' ? '5' : '4'} className={styles.noUsers}>Aucun utilisateur trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default HomeHR;
