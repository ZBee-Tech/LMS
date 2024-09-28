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
    } else {
      const newUserId = generateUserId();
      setUserId(newUserId);
      localStorage.setItem('userId', newUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLeaveRequests();
    }
  }, [userId]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const leaveRequestCollection = collection(db, 'leaveRequests');
      const q = query(leaveRequestCollection, where('userId', '==', userId));
      const leaveRequestSnapshot = await getDocs(q);
      const filteredRequests = leaveRequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setLeaveRequests(filteredRequests);

      const approvedRequests = filteredRequests.filter(request => request.CeoStatus === 1);
      if (approvedRequests.length > 0) {
        const currentCount = parseInt(localStorage.getItem('approvedLeaveCount')) || 0;
        localStorage.setItem('approvedLeaveCount', currentCount + 1);
        localStorage.setItem('userStatus', '1');
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de congé :', error);
      toast.error('Échec de la récupération des demandes de congé.');
    }
    setLoading(false);
  };

  const generateUserId = () => {
    return `user-${Math.floor(Math.random() * 10000)}`;
  };

  const getStatusLabel = (HodStatus, HrStatus, CeoStatus) => {
    if (HodStatus === 0) return 'En attente par le Responsable';
    if (HodStatus === 1 && HrStatus === 0) return 'En attente par les RH';
    if (HodStatus === 1 && HrStatus === 1 && CeoStatus === 0) return 'En attente par le PDG';
    if (HodStatus === -1) return 'Refusé par le Responsable';
    if (HrStatus === -1) return 'Refusé par les RH';
    if (CeoStatus === -1) return 'Refusé par le PDG';
    if (HodStatus === 1 && HrStatus === 1 && CeoStatus === 1) return 'Approuvé par le PDG';

    return 'Statut Inconnu';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Suivre les demandes de congé</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type de congé</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Raison</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Chargement...</td>
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
              <td colSpan="5">Aucune demande de congé trouvée pour votre ID.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default LeaveTrackingForm;
