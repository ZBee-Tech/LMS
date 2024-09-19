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
      try {
        const leaveRequestCollection = collection(db, 'leaveRequests');
        const leaveRequestSnapshot = await getDocs(leaveRequestCollection);
        const leaveRequestData = leaveRequestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
         const ceoRequests = leaveRequestData.filter(request => request.HodStatus === 1 && request.HrStatus === 1);
        setLeaveRequests(ceoRequests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Failed to fetch leave requests.');
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByCEO: ceoId,
        CeoStatus: 1,   
        Status: 1        
      });
      toast.success('Leave request approved by CEO successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedByCEO: ceoId, CeoStatus: 1, Status: 1 } : request
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
        CeoStatus: -1,  
        Status: -1      
      });
      toast.success('Leave request rejected by CEO successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedByCEO: ceoId, CeoStatus: -1, Status: -1 } : request
        )
      );
    } catch (error) {
      console.error('Error rejecting leave request by CEO:', error);
      toast.error('Failed to reject leave request by CEO.');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approved by CEO</span>;
      case -1:
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
            <th>HOD Approved</th>
            <th>HR Approved</th>
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
              <td>{request.HodStatus === 1 ? 'Yes' : 'No'}</td>
              <td>{request.HrStatus === 1 ? 'Yes' : 'No'}</td>
              <td>{getStatusLabel(request.Status)}</td>
              <td>
                {request.CeoStatus === 0 && (
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
