import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveRequestsPage.module.css';

const LeaveRequestsPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [hodId, setHodId] = useState('');
  const organizationId = localStorage.getItem('organizationId');

  useEffect(() => {
    const savedHodId = localStorage.getItem('userId');
    setHodId(savedHodId);

    const fetchLeaveRequests = async () => {
      const leaveRequestCollection = collection(db, 'leaveRequests');
      const leaveRequestSnapshot = await getDocs(leaveRequestCollection);
      const leaveRequestData = leaveRequestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filteredRequests = leaveRequestData.filter(request => request.organizationID === organizationId);
      setLeaveRequests(filteredRequests);

       filteredRequests.forEach(request => {
        if (request.HodStatus === 0) {
          localStorage.setItem('HodStatus', '0');   
        }
      });
    };

    fetchLeaveRequests();
  }, [organizationId]);

  const handleApprove = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedbyHOD: hodId,
        HodStatus: 1
      });
      toast.success('Leave request approved successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedbyHOD: hodId, HodStatus: 1 } : request
        )
      );
    } catch (error) {
      console.error('Error approving leave request:', error);
      toast.error('Failed to approve leave request.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedbyHOD: hodId,
        HodStatus: -1   
      });
      toast.success('Leave request declined successfully!');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedbyHOD: hodId, HodStatus: -1 } : request
        )
      );
    } catch (error) {
      console.error('Error declining leave request:', error);
      toast.error('Failed to decline leave request.');
    }
  };

  const getHodStatusLabel = (hodStatus) => {
    switch (hodStatus) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approuvé</span>;
      case -1:
        return <span className={`${styles.status} ${styles.declined}`}>Refusé</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>En Attente</span>;
    }
    
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Demandes de Congé</h2>
      <div className='tableContainer'> 
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type de Congé</th>
              <th>Date de Début</th>
              <th>Date de Fin</th>
              <th>Raison</th>
              <th>Demandé Par</th>
              <th>Statut HOD</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.leaveType}</td>
                  <td>{new Date(request.startDate.seconds * 1000).toLocaleDateString()}</td>
                  <td>{new Date(request.endDate.seconds * 1000).toLocaleDateString()}</td>
                  <td>{request.reason || 'N/A'}</td>
                  <td>{request.fullName}</td>
                  <td>{getHodStatusLabel(request.HodStatus)}</td>
                  <td>
                    {request.HodStatus === 0 && (
                      <>
                        <button 
                          className={styles.approveButton} 
                          onClick={() => handleApprove(request.id)}>
                          Approuver
                        </button>
                        <button 
                          className={styles.declineButton} 
                          onClick={() => handleDecline(request.id)}>
                          Refuser
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noRequests}>Aucune demande de congé trouvée pour votre organisation.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
  
};

export default LeaveRequestsPage;
