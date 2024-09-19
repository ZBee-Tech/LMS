import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, doc, setDoc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';  
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';

const LeaveTypeManager = () => {
  const [leaveType, setLeaveType] = useState('');
  const [limit, setLimit] = useState('');  
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [hrId, setHrId] = useState(localStorage.getItem('userId') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     const fetchLeaveTypes = async () => {
      try {
        const leaveTypesCollection = collection(db, 'LeaveTypes');
        const leaveTypesSnapshot = await getDocs(leaveTypesCollection);
        const leaveTypesList = leaveTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaveTypes(leaveTypesList);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to fetch leave types.');
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleAddLeaveType = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdAt = Timestamp.now();
      
      const leaveData = {
        leaveType: leaveType.trim(),
        limit: parseInt(limit, 10) || 0,
        createdAt,
        createdBy: hrId,
        modifiedAt: null,
        modifiedBy: null
      };

      const leaveRef = doc(db, 'LeaveTypes', doc(collection(db, 'LeaveTypes')).id);
      await setDoc(leaveRef, leaveData);

      toast.success('Leave type added successfully!');
      
      setLeaveType('');
      setLimit(''); 

       const leaveTypesCollection = collection(db, 'LeaveTypes');
      const leaveTypesSnapshot = await getDocs(leaveTypesCollection);
      const leaveTypesList = leaveTypesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaveTypes(leaveTypesList);
    } catch (error) {
      console.error('Error adding leave type:', error);
      toast.error('Failed to add leave type.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeaveType = async (id) => {
    try {
      await deleteDoc(doc(db, 'LeaveTypes', id));
      toast.success('Leave type deleted successfully!');
      
       const leaveTypesCollection = collection(db, 'LeaveTypes');
      const leaveTypesSnapshot = await getDocs(leaveTypesCollection);
      const leaveTypesList = leaveTypesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaveTypes(leaveTypesList);
    } catch (error) {
      console.error('Error deleting leave type:', error);
      toast.error('Failed to delete leave type.');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h6" align="center" gutterBottom>
        Add New Leave Type
      </Typography>
      <form onSubmit={handleAddLeaveType}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Leave Type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Limit (Days)"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
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
              {loading ? <CircularProgress size={24} /> : 'Add Leave Type'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h6" align="center" gutterBottom>
        Leave Types
      </Typography>
      <Grid container spacing={2}>
        {leaveTypes.map(({ id, leaveType, limit }) => (
          <Grid item xs={12} key={id}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">{leaveType}</Typography>
                <Typography variant="body2">Limit: {limit} days</Typography>
              </Grid>
              <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteLeaveType(id)}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <ToastContainer />
    </Container>
  );
};

export default LeaveTypeManager;
