import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, doc, setDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';  
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase-config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, MenuItem, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import { sendEmail } from '../apis/api';

const AddUser = () => {
  const [role, setRole] = useState('Select Role');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [hods, setHods] = useState([]);  
  const [selectedHod, setSelectedHod] = useState('');  
  const [createdBy, setCreatedBy] = useState(localStorage.getItem('userId') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === 'Employee') {
      const fetchHods = async () => {
        const hodsQuery = query(collection(db, 'Users'), where('role', '==', 'HOD'));
        const querySnapshot = await getDocs(hodsQuery);
        const hodList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHods(hodList);
      };
      fetchHods();
    }
  }, [role]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid; 
      const createdAt = Timestamp.now();
  
      await sendEmailVerification(user);
  
       let hodName = '';
  
       if (role === 'Employee') {
        const selectedHodDoc = hods.find(hod => hod.id === selectedHod);
        hodName = selectedHodDoc ? selectedHodDoc.fullName : 'Unknown HOD';
      } else if (role === 'HOD') {
         hodName = null; 
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
        hodName  
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
      setRole('Select Role');
      setDepartment('');
      setSelectedHod('');
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
        Add New User
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
              <MenuItem value="Select Role">Select Role</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>  
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

          {role === 'HOD' && (  
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Department"
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
                label="Select HOD"
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
