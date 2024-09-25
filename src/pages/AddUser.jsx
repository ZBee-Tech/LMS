import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';  
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase-config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, MenuItem, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import { sendEmail } from '../apis/api';

const AddUser = () => {
  const [role, setRole] = useState('HR Manager');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(Math.random().toString(36).slice(2));
  const [createdBy, setCreatedBy] = useState(localStorage.getItem('userId') || '');
  const [loading, setLoading] = useState(false);
  const [UID, setUID] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUID(storedUserId);
      console.log('User Role from Local Storage:', storedUserId);
    } else {
      setUID('');
    }
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid; 
      const createdAt = Timestamp.now();

      await sendEmailVerification(user);

      const userData = {
        fullName,
        email,
        username,
        role,
        createdBy,
        createdAt,
        modifiedBy: null,
        modifiedAt: null,
        organizationId: UID
      };

      const userRef = doc(db, 'Users', userId);  
      await setDoc(userRef, userData);  

      await sendEmail({
        to: email,
        userEmail: email,
        password: password,
        role: role
      });

      toast.success('User added successfully! Verification email sent.');

      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRole('HR Manager');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h6" align="center" gutterBottom>
        Ajouter un nouvel utilisateur
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
              <MenuItem value="HR Manager">Responsable RH</MenuItem>
              {/* Ajoutez d'autres rôles ici si nécessaire */}
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
  
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Ajouter l\'utilisateur'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
  
};

export default AddUser;
