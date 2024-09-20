import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveTrackingForm.module.css';

const LeaveTrackingForm = () => {
  const [userId, setUserId] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('Saved User ID:', storedUserId);  
    } else {
      const newUserId = generateUserId();  
      setUserId(newUserId);
      localStorage.setItem('userId', newUserId);
      console.log('Generated and saved new User ID:', newUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLeaveRequests();
    }
  }, [userId]);

  const fetchLeaveRequests = async () => {
    console.log('Fetching leave requests for user ID:', userId);
    setLoading(true);
    try {
      const leaveRequestCollection = collection(db, 'leaveRequests');
      const q = query(leaveRequestCollection, where('userId', '==', userId));
      const leaveRequestSnapshot = await getDocs(q);
      const filteredRequests = leaveRequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      console.log('Filtered leave requests:', filteredRequests);
      
      setLeaveRequests(filteredRequests);

       const approvedRequests = filteredRequests.filter(request => request.CeoStatus === 1);
      if (approvedRequests.length > 0) {
        const currentCount = parseInt(localStorage.getItem('approvedLeaveCount')) || 0;
        localStorage.setItem('approvedLeaveCount', currentCount + 1);
        console.log('Incremented approved leave count:', currentCount + 1);
      }

    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to fetch leave requests.');
    }
    setLoading(false);
  };

  const generateUserId = () => {
    return `user-${Math.floor(Math.random() * 10000)}`;
  };

  const getStatusLabel = (HodStatus, HrStatus, CeoStatus) => {
    if (HodStatus === 0) return 'Pending by HOD';
    if (HodStatus === 1 && HrStatus === 0) return 'Pending by HR';
    if (HodStatus === 1 && HrStatus === 1 && CeoStatus === 0) return 'Pending by CEO';
    if (HodStatus === -1) return 'Declined by HOD';
    if (HrStatus === -1) return 'Declined by HR';
    if (CeoStatus === -1) return 'Declined by CEO';
    if (HodStatus === 1 && HrStatus === 1 && CeoStatus === 1) return 'Approved by CEO';
  
    return 'Unknown Status';
  };
  
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Track Leave Requests</h2>
      <div className={styles.userIdDisplay}>
        User ID: {userId}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.leaveType}</td>
                <td>{new Date(request.startDate.seconds * 1000).toLocaleDateString()}</td>
                <td>{new Date(request.endDate.seconds * 1000).toLocaleDateString()}</td>
                <td>{request.reason || 'N/A'}</td>
                <td>{getStatusLabel(request.HodStatus, request.HrStatus, request.CeoStatus)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No leave requests found for your ID.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default LeaveTrackingForm;
