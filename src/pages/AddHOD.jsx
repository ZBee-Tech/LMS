import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { collection, doc, setDoc, Timestamp, query, where, getDocs, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, MenuItem, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import { sendEmail } from '../apis/api';

const AddUser = () => {
  const [role, setRole] = useState('Select Role');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(Math.random().toString(36).slice(2));
  const [department, setDepartment] = useState('');
  const [hods, setHods] = useState([]);
  const [selectedHod, setSelectedHod] = useState('');
  const [createdBy, setCreatedBy] = useState(localStorage.getItem('userId') || '');
  const [organizationId, setOrganizationId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizationId = async () => {
      if (createdBy) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', createdBy));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const orgId = userData.organizationId || '';
            setOrganizationId(orgId);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching organization ID:', error);
        }
      }
    };
    fetchOrganizationId();
  }, [createdBy]);

  useEffect(() => {
    if (role === 'Employee') {
      const fetchHods = async () => {
        try {
          const hodsQuery = query(collection(db, 'Users'), where('role', '==', 'HOD'), where('organizationId', '==', organizationId));
          const querySnapshot = await getDocs(hodsQuery);
          const hodList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHods(hodList);
        } catch (error) {
          console.error('Error fetching HODs:', error);
        }
      };
      if (organizationId) {
        fetchHods();
      }
    }
  }, [role, organizationId]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;
      const createdAt = Timestamp.now();

      await sendEmailVerification(user);

      let hodName = null;  
      if (role === 'Employee') {
        const selectedHodDoc = hods.find(hod => hod.id === selectedHod);
        hodName = selectedHodDoc ? selectedHodDoc.fullName : 'Unknown HOD';
      }

      const userData = {
        fullName,
        email,
        username,
        role,
        createdBy,
        createdAt,
        modifiedBy: null,
        modifiedAt: null,
        hodName,
        organizationId,
        department
      };

      const userRef = doc(db, 'Users', userId);
      await setDoc(userRef, userData);

      await sendEmail({
        to: email,
        userEmail: email,
        password: password,
        role: role
      });

      toast.success('Utilisateur ajouté avec succès ! E-mail de vérification envoyé.');

      // Reset form fields
      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRole('Select Role');
      setDepartment('');
      setSelectedHod('');
    } catch (error) {
      console.error(`Erreur lors de l'ajout de l'utilisateur :`, error);
      toast.error('Failed to add user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h6" align="center" gutterBottom>
        Ajouter un Nouvel Utilisateur
      </Typography>
      <form onSubmit={handleAddUser}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Rôle"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="Sélectionner un Rôle">Sélectionner un Rôle</MenuItem>
              <MenuItem value="Employee">Employé</MenuItem>
              <MenuItem value="HOD">Responsable</MenuItem>
            </TextField>
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom Complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
  
          {role === 'HOD' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Département"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          )}
  
          {role === 'Employee' && (
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Sélectionner Responsable"
                value={selectedHod}
                onChange={(e) => setSelectedHod(e.target.value)}
                variant="outlined"
                required
              >
                {hods.map(hod => (
                  <MenuItem key={hod.id} value={hod.id}>
                    {hod.fullName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
  
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Ajouter un Utilisateur'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
  
};

export default AddUser;
