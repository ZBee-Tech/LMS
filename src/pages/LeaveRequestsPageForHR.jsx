import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveRequestsPageForHR.module.css';

const LeaveRequestsPageForHR = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [hrId, setHrId] = useState('');

  useEffect(() => {
    const savedHrId = localStorage.getItem('userId');  
    setHrId(savedHrId);

    const fetchLeaveRequests = async () => {
      const leaveRequestCollection = collection(db, 'leaveRequests');
      const leaveRequestSnapshot = await getDocs(leaveRequestCollection);
      const leaveRequestData = leaveRequestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const hrRequests = leaveRequestData.filter(request => request.ApprovedbyHOD);  
      setLeaveRequests(hrRequests);
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByHR: hrId,
        Status: 2  
      });
      toast.success('Leave request approved by HR successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ApprovedByHR: hrId, Status: 2 } : request
        )
      );
    } catch (error) {
      console.error('Error approving leave request by HR:', error);
      toast.error('Failed to approve leave request by HR.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByHR: hrId,
        Status: -2  
      });
      toast.success('Leave request declined by HR successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ApprovedByHR: hrId, Status: -2 } : request
        )
      );
    } catch (error) {
      console.error('Error declining leave request by HR:', error);
      toast.error('Failed to decline leave request by HR.');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 2:
        return <span className={`${styles.status} ${styles.approved}`}>Approved by HR</span>;
      case -2:
        return <span className={`${styles.status} ${styles.declined}`}>Declined by HR</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>Pending HOD Approval</span>;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Leave Requests for HR</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Requested By</th>
            <th>HOD Approved By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.leaveType}</td>
              <td>{new Date(request.startDate.seconds * 1000).toLocaleDateString()}</td>
              <td>{new Date(request.endDate.seconds * 1000).toLocaleDateString()}</td>
              <td>{request.reason || 'N/A'}</td>
              <td>{request.fullName}</td>
              <td>{request.ApprovedbyHOD ? 'Yes' : 'No'}</td>
              <td>{getStatusLabel(request.Status)}</td>
              <td>
                {request.Status === 1 && (
                  <>
                    <button 
                      className={styles.approveButton} 
                      onClick={() => handleApprove(request.id)}>
                      Approve
                    </button>
                    <button 
                      className={styles.declineButton} 
                      onClick={() => handleDecline(request.id)}>
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default LeaveRequestsPageForHR;
