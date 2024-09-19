import React, { useState } from 'react';
import { db } from '../firebase-config';  
import { collection, addDoc, Timestamp } from 'firebase/firestore';  
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
  const [password, setPassword] = useState('');
  const [createdBy, setCreatedBy] = useState(localStorage.getItem('userId') || '');
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const createdAt = Timestamp.now();

      await sendEmailVerification(userCredential.user);

      const userData = {
        fullName,
        email,
        username,
        role,
        createdBy,
        createdAt,
        modifiedBy: null,
        modifiedAt: null
      };

      await addDoc(collection(db, 'Users'), { ...userData, userId });

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
      <Typography variant="h5" align="center" gutterBottom>
        Add User
      </Typography>
      <form onSubmit={handleAddUser}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="HR Manager">HR Manager</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
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
              label="Password"
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
              {loading ? <CircularProgress size={24} /> : 'Add User'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default AddUser;
