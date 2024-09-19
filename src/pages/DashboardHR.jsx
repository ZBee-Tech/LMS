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

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
      console.log('User Role from Local Storage:', storedUserRole);
    } else {
      setUserRole('');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userCollection = collection(db, 'Users');
      const userSnapshot = await getDocs(userCollection);
      const allUsers = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const filteredUsers = allUsers
        .filter((user) => user.role === 'Employee' || user.role === 'HOD')
        .map((user) => ({
          ...user,
          displayInfo: user.role === 'Employee' ? user.hodName || 'Unknown HOD' : user.department || 'Unknown Department',
        }));

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users.');
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
        toast.success('Leave limit updated successfully.');
      } catch (error) {
        console.error('Error updating leave limit:', error);
        toast.error('Failed to update leave limit.');
      }
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'Users', id));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome to HR Dashboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>HOD/Department</th>
             <th>Leave Limit</th>
             <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={userRole === 'HR Manager' ? '5' : '4'} className={styles.loading}>Loading...</td>
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
                      <button onClick={() => handleSubmit(user.id)} className={styles.button}>Submit</button>
                    </td>
                  </>
                )}
                {userRole === 'HR Manager' && (
                  <td>
                    <button onClick={() => deleteUser(user.id)} className={styles.button}>Delete</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userRole === 'HR Manager' ? '5' : '4'} className={styles.noUsers}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default HomeHR;
