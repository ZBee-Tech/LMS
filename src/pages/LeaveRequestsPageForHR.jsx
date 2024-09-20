import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveRequestsPageForHR.module.css';

const LeaveRequestsPageForHR = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [hrId, setHrId] = useState('');
  const organizationId = localStorage.getItem('organizationId');  

  useEffect(() => {
    const savedHrId = localStorage.getItem('userId');
    setHrId(savedHrId);

    const fetchLeaveRequests = async () => {
      try {
        const leaveRequestCollection = collection(db, 'leaveRequests');
        const leaveRequestSnapshot = await getDocs(leaveRequestCollection);
        const leaveRequestData = leaveRequestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

         const hrRequests = leaveRequestData.filter(request => 
          request.HodStatus === 1 && request.organizationID === organizationId
        );
        setLeaveRequests(hrRequests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Failed to fetch leave requests.');
      }
    };

    fetchLeaveRequests();
  }, [organizationId]);

  const handleApprove = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByHR: hrId,
        HrStatus: 1   
      });
      toast.success('Leave request approved by HR successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ApprovedByHR: hrId, HrStatus: 1 } : request
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
        HrStatus: -1   
      });
      toast.success('Leave request declined by HR successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ApprovedByHR: hrId, HrStatus: -1 } : request
        )
      );
    } catch (error) {
      console.error('Error declining leave request by HR:', error);
      toast.error('Failed to decline leave request by HR.');
    }
  };

  const getStatusLabel = (HrStatus) => {
    switch (HrStatus) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approved by HR</span>;
      case -1:
        return <span className={`${styles.status} ${styles.declined}`}>Declined by HR</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>Pending</span>;
    }
  };

  const getCEOApprovalStatus = (CeoStatus) => {
    switch (CeoStatus) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approved by CEO</span>;
      case -1:
        return <span className={`${styles.status} ${styles.declined}`}>Declined by CEO</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>Pending</span>;
    }
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate.seconds * 1000);
    const end = new Date(endDate.seconds * 1000);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;  
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
            <th>Days</th>
            <th>Reason</th>
            <th>Requested By</th>
            <th>HOD Approved</th>
            <th>CEO Approved</th>
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
              <td>{calculateLeaveDays(request.startDate, request.endDate)}</td>
              <td>{request.reason || 'N/A'}</td>
              <td>{request.fullName}</td>
              <td>{request.HodStatus === 1 ? 'Yes' : 'No'}</td>
              <td>{getCEOApprovalStatus(request.CeoStatus)}</td>
              <td>{getStatusLabel(request.HrStatus)}</td>
              <td>
                {request.HrStatus === 0 && (   
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
