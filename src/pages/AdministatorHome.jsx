import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/CSS/ACEODashboard.module.css';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  CircularProgress,
  Modal,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [recordCount, setRecordCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'Users'));
        const usersList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role !== 'Admin');

        const ceo = usersList.find(user => user.role === 'CEO');
        const updatedUsers = usersList.map(user => ({
          ...user,
          organizationName: user.role === 'CEO' ? user.fullName : (ceo ? ceo.fullName : 'N/A'),
        }));

        setUsers(updatedUsers);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        toast.error('Échec du chargement des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteDoc(doc(db, 'Users', userId));
        setUsers(users.filter(user => user.id !== userId));
        toast.success('Utilisateur supprimé avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        toast.error('Échec de la suppression de l\'utilisateur.');
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
      toast.success('Utilisateur mis à jour avec succès.');
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      toast.error('Échec de la mise à jour de l\'utilisateur.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const handleExportCSV = () => {
    const csvRows = [];
    const headers = ['Organisation', 'Nom Complet', 'Email', 'Rôle', 'Nom d\'Utilisateur'];
    csvRows.push(headers.join(','));

    filteredUsers.forEach(user => {
      const row = [
        user.organizationName,
        user.fullName,
        user.email,
        user.role,
        user.username
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'utilisateurs.csv');
    a.click();
  };

  return (
    <Container className={styles.dashboardContainer}>
      <Typography variant="h6" align="center" gutterBottom>
        Tous les Utilisateurs et Organisations
      </Typography>
      <TextField
        label="Rechercher des Utilisateurs"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-filter-label">Filtrer par Rôle</InputLabel>
            <Select
              labelId="role-filter-label"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value=""> </MenuItem>
              <MenuItem value="CEO">PDG</MenuItem>
              <MenuItem value="HR Manager">Responsable RH</MenuItem>
              <MenuItem value="HOD">Chef de Département</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="record-count-label">Enregistrements par Page</InputLabel>
            <Select
              labelId="record-count-label"
              value={recordCount}
              onChange={(e) => setRecordCount(e.target.value)}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExportCSV}
            fullWidth
          >
            Exporter en CSV
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress className={styles.loader} />
      ) : (
        <Table className={styles.userTable}>
          <TableHead>
            <TableRow>
              <TableCell>Organisation</TableCell>
              <TableCell>Nom Complet</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Nom d'Utilisateur</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(0, recordCount).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.organizationName}</TableCell>
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
                    Modifier
                  </Button> 
                  &nbsp;
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                    className={styles.actionButton}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-modal-description"
        className={styles.modalBackdrop}
      >
        <Box className={styles.modalBox}>
          <IconButton onClick={handleModalClose} className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" id="edit-user-modal-title" className={styles.modalTitle}>
            Modifier les Détails de l'Utilisateur
          </Typography>
          {selectedUser && (
            <>
              <TextField
                label="Nom Complet"
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
                label="Nom d'Utilisateur"
                name="username"
                value={selectedUser.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                className={styles.inputField}
              />
              <Button variant="contained" color="primary" onClick={handleSaveChanges} fullWidth>
                Sauvegarder les Modifications
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <ToastContainer />
    </Container>
  );

};

export default AdminDashboard;
