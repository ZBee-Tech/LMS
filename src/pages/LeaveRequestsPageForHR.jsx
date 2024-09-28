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

        const hasPendingRequests = hrRequests.some(request => request.HrStatus === 0);
        if (hasPendingRequests) {
          localStorage.setItem('HRStatus', '0');  
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes de congé :', error);
        toast.error('Échec de la récupération des demandes de congé.');
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
      toast.success('Demande de congé approuvée par les RH avec succès !');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ApprovedByHR: hrId, HrStatus: 1 } : request
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande de congé par les RH :', error);
      toast.error('Échec de l\'approbation de la demande de congé par les RH.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByHR: hrId,
        HrStatus: -1   
      });
      toast.success('Demande de congé refusée par les RH avec succès !');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ApprovedByHR: hrId, HrStatus: -1 } : request
        )
      );
    } catch (error) {
      console.error('Erreur lors du refus de la demande de congé par les RH :', error);
      toast.error('Échec du refus de la demande de congé par les RH.');
    }
  };

  const getStatusLabel = (HrStatus) => {
    switch (HrStatus) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approuvé par les RH</span>;
      case -1:
        return <span className={`${styles.status} ${styles.declined}`}>Refusé par les RH</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>En attente</span>;
    }
  };

  const getCEOApprovalStatus = (CeoStatus) => {
    switch (CeoStatus) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approuvé par le PDG</span>;
      case -1:
        return <span className={`${styles.status} ${styles.declined}`}>Refusé par le PDG</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>En attente</span>;
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
      <h2 className={styles.heading}>Demandes de Congé pour les RH</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type de Congé</th>
            <th>Date de Début</th>
            <th>Date de Fin</th>
            <th>Jours</th>
            <th>Raison</th>
            <th>Demandé par</th>
            <th>Approuvé par le Responsable</th>
            <th>Approuvé par le PDG</th>
            <th>Statut</th>
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
              <td>{request.HodStatus === 1 ? 'Oui' : 'Non'}</td>
              <td>{getCEOApprovalStatus(request.CeoStatus)}</td>
              <td>{getStatusLabel(request.HrStatus)}</td>
              <td>
                {request.HrStatus === 0 && (   
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
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
  
};

export default LeaveRequestsPageForHR;
