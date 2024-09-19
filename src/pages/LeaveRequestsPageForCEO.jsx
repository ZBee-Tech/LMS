import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveRequestsPageForCEO.module.css';

const LeaveRequestsPageForCEO = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [ceoId, setCeoId] = useState('');

  useEffect(() => {
    const savedCeoId = localStorage.getItem('userId');  
    setCeoId(savedCeoId);

    const fetchLeaveRequests = async () => {
      const leaveRequestCollection = collection(db, 'leaveRequests');
      const leaveRequestSnapshot = await getDocs(leaveRequestCollection);
      const leaveRequestData = leaveRequestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       const ceoRequests = leaveRequestData.filter(request => request.ApprovedbyHOD && request.ApprovedByHR);
      setLeaveRequests(ceoRequests);
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByCEO: ceoId,
        Status: 3  
      });
      toast.success('Leave request approved by CEO successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedByCEO: ceoId, Status: 3 } : request
        )
      );
    } catch (error) {
      console.error('Error approving leave request by CEO:', error);
      toast.error('Failed to approve leave request by CEO.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByCEO: ceoId,
        Status: -3  
      });
      toast.success('Leave request rejected by CEO successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedByCEO: ceoId, Status: -3 } : request
        )
      );
    } catch (error) {
      console.error('Error rejecting leave request by CEO:', error);
      toast.error('Failed to reject leave request by CEO.');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 3:
        return <span className={`${styles.status} ${styles.approved}`}>Approved by CEO</span>;
      case -3:
        return <span className={`${styles.status} ${styles.declined}`}>Rejected by CEO</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>Pending CEO Approval</span>;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Leave Requests for CEO</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Requested By</th>
            <th>HOD Approved By</th>
            <th>HR Approved By</th>
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
              <td>{request.ApprovedByHR ? 'Yes' : 'No'}</td>
              <td>{getStatusLabel(request.Status)}</td>
              <td>
                {request.Status === 2 && (
                  <>
                    <button 
                      className={styles.approveButton} 
                      onClick={() => handleApprove(request.id)}>
                      Approve
                    </button>
                    <button 
                      className={styles.rejectButton} 
                      onClick={() => handleReject(request.id)}>
                      Reject
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

export default LeaveRequestsPageForCEO;