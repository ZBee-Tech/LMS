import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveRequestsPageForCEO.module.css';

const LeaveRequestsPageForCEO = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [ceoId, setCeoId] = useState('');
  const organizationId = localStorage.getItem('organizationId');  

  useEffect(() => {
    const savedCeoId = localStorage.getItem('userId');  
    setCeoId(savedCeoId);

    const fetchLeaveRequests = async () => {
      try {
        const leaveRequestCollection = collection(db, 'leaveRequests');
        const leaveRequestSnapshot = await getDocs(leaveRequestCollection);
        const leaveRequestData = leaveRequestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const ceoRequests = leaveRequestData.filter(request => 
          request.HodStatus === 1 && 
          request.HrStatus === 1 && 
          request.organizationID === ceoId
        );
        
        setLeaveRequests(ceoRequests);
        
         const hasPendingRequests = ceoRequests.some(request => request.CeoStatus === 0);
        if (hasPendingRequests) {
          localStorage.setItem('ceoStatus', '0');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes de congé :', error);
        toast.error('Échec de la récupération des demandes de congé.');
      }
    };

    fetchLeaveRequests();
  }, [ceoId]);

  const handleApprove = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, {
        ApprovedByCEO: ceoId,
        CeoStatus: 1,   
        Status: 1        
      });
      toast.success('Demande de congé approuvée par le PDG avec succès !');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedByCEO: ceoId, CeoStatus: 1, Status: 1 } : request
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande de congé par le PDG :', error);
      toast.error('Échec de l\'approbation de la demande de congé par le PDG.');
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
      toast.success('Demande de congé rejetée par le PDG avec succès !');
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, ApprovedByCEO: ceoId, CeoStatus: -1, Status: -1 } : request
        )
      );
    } catch (error) {
      console.error('Erreur lors du rejet de la demande de congé par le PDG :', error);
      toast.error('Échec du rejet de la demande de congé par le PDG.');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return <span className={`${styles.status} ${styles.approved}`}>Approuvé par le PDG</span>;
      case -1:
        return <span className={`${styles.status} ${styles.declined}`}>Rejeté par le PDG</span>;
      default:
        return <span className={`${styles.status} ${styles.pending}`}>En attente de l'approbation du PDG</span>;
    }
    
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Demandes de Congé pour le PDG</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type de Congé</th>
            <th>Date de Début</th>
            <th>Date de Fin</th>
            <th>Raison</th>
            <th>Demandé Par</th>
            <th>Approuvé par le HOD</th>
            <th>Approuvé par les RH</th>
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
              <td>{request.reason || 'N/A'}</td>
              <td>{request.fullName}</td>
              <td>{request.HodStatus === 1 ? 'Oui' : 'Non'}</td>
              <td>{request.HrStatus === 1 ? 'Oui' : 'Non'}</td>
              <td>{getStatusLabel(request.Status)}</td>
              <td>
                {request.CeoStatus === 0 && (
                  <>
                    <button 
                      className={styles.approveButton} 
                      onClick={() => handleApprove(request.id)}>
                      Approuver
                    </button>
                    <button 
                      className={styles.rejectButton} 
                      onClick={() => handleReject(request.id)}>
                      Rejeter
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
