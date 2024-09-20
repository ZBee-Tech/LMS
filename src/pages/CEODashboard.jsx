import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/CSS/ACEODashboard.module.css';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Container, Typography, CircularProgress, Modal, Box, TextField, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CEODashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const ceoId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'Users'));
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
        // Filter users by organizationId matching with CEO ID
        const filteredUsers = usersList.filter((user) => user.organizationId === ceoId);
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [ceoId]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'Users', userId));
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user.');
      }
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, 'Users', selectedUser.id);
      await updateDoc(userRef, {
        fullName: selectedUser.fullName,
        username: selectedUser.username,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? selectedUser : user
        )
      );
      toast.success('User updated successfully.');
      handleModalClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  return (
    <Container className={styles.dashboardContainer}>
      <Typography variant="h4" align="center" gutterBottom>
        CEO Dashboard
      </Typography>
      {loading ? (
        <CircularProgress className={styles.loader} />
      ) : (
        <Table className={styles.userTable}>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(user)}
                    className={styles.actionButton}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                    className={styles.actionButton}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit User Modal */}
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-modal-description"
        className={styles.modalBackdrop} // Added backdrop styling
      >
        <Box className={styles.modalBox}>
          <IconButton onClick={handleModalClose} className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" id="edit-user-modal-title" className={styles.modalTitle}>
            Edit User Details
          </Typography>
          {selectedUser && (
            <>
              <TextField
                label="Full Name"
                name="fullName"
                value={selectedUser.fullName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                className={styles.inputField}
              />
              <TextField
                label="Email"
                name="email"
                value={selectedUser.email}
                fullWidth
                margin="normal"
                disabled
                className={styles.inputField}
              />
              <TextField
                label="Role"
                name="role"
                value={selectedUser.role}
                fullWidth
                margin="normal"
                disabled
                className={styles.inputField}
              />
              <TextField
                label="Username"
                name="username"
                value={selectedUser.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                className={styles.inputField}
              />
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" onClick={handleSaveChanges} className={styles.saveButton}>
                  Save Changes
                </Button>
                <Button variant="contained" color="default" onClick={handleModalClose} className={styles.cancelButton}>
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default CEODashboard;
