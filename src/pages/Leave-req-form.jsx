import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LeaveRequestForm.module.css';
import { db } from '../firebase-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const LeaveRequestForm = () => {
  const [leaveType, setLeaveType] = useState('');
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [leaveLimits, setLeaveLimits] = useState({});
  const [allUsersLeaveLimits, setAllUsersLeaveLimits] = useState([]);
  const [daysRequested, setDaysRequested] = useState(0);
  const [sundaysExcluded, setSundaysExcluded] = useState(0);
  const [Check, setCheck] = useState('');
  const [organizationID, setorganizationid] = useState('');

  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUserId = localStorage.getItem('userId');
    const savedFullName = localStorage.getItem('fullName');
    const organizationid = localStorage.getItem('organizationId');

    if (savedRole && savedUserId && savedFullName) {
      setRole(savedRole);
      setUserId(savedUserId);
      setFullName(savedFullName);
      setorganizationid(organizationid);
    } else {
      toast.error('Les données de connexion ne sont pas disponibles. Veuillez vous reconnecter.');
    }
  }, []);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const leaveTypesCollection = collection(db, 'LeaveTypes');
        const leaveTypesSnapshot = await getDocs(leaveTypesCollection);
        const leaveTypesList = leaveTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaveTypes(leaveTypesList);
      } catch (error) {
        console.error('Erreur lors de la récupération des types de congé :', error);
        toast.error('Échec de la récupération des types de congé.');
      }
    };

    const fetchUserLeaveLimits = async () => {
      try {
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllUsersLeaveLimits(usersList);

        usersList.forEach(user => {
          if (user.id === userId) {
            setCheck(user.leaveLimit);
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des limites de congé de l\'utilisateur :', error);
        toast.error('Échec de la récupération des limites de congé de l\'utilisateur.');
      }
    };

    fetchLeaveTypes();
    fetchUserLeaveLimits();
  }, [userId]);

  useEffect(() => {
    if (startDate && endDate) {
      let totalDays = 0;
      let sundaysCount = 0;
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0) {  
          totalDays++;
        } else {
          sundaysCount++;  
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDaysRequested(totalDays);
      setSundaysExcluded(sundaysCount);
    } else {
      setDaysRequested(0);
      setSundaysExcluded(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (daysRequested > Check) {
      toast.error(`Veuillez appliquer conformément à votre limite de congé. Votre limite de congé est de ${Check} jours.`);
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Veuillez sélectionner à la fois une date de début et une date de fin.');
      return;
    }

    if (endDate < startDate) {
      toast.error('La date de fin doit être après la date de début.');
      return;
    }

    const leaveLimit = leaveLimits[leaveType];
    if (leaveLimit !== undefined && daysRequested > leaveLimit) {
      toast.error(`Vous ne pouvez pas demander plus de ${leaveLimit} jours pour le type de congé ${leaveType}.`);
      return;
    }

    const createdAt = new Date();
    const modifiedAt = new Date();
    const createdBy = userId;
    const modifiedBy = userId;

    const leaveRequestData = {
      leaveType,
      startDate,
      endDate,
      reason,
      role,
      userId,
      fullName,
      createdAt,
      createdBy,
      modifiedAt,
      modifiedBy,
      Status: 0,
      HodStatus: 0,
      HrStatus: 0,
      CeoStatus: 0,
      organizationID,
    };

    try {
      await addDoc(collection(db, 'leaveRequests'), leaveRequestData);
      toast.success('Demande de congé soumise avec succès !');

      setLeaveType('');
      setStartDate(null);
      setEndDate(null);
      setReason('');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la demande de congé dans Firebase :', error);
      toast.error('Échec de la soumission de la demande de congé.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="leaveType" className={styles.label}>Type de congé</label>
            <select
              id="leaveType"
              className={styles.select}
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Sélectionner le type de congé</option>
              {leaveTypes.map(({ id, leaveType }) => (
                <option key={id} value={leaveType}>{leaveType}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate" className={styles.label}>Date de début</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className={styles.input}
              dateFormat="yyyy/MM/dd"
              placeholderText="Sélectionner la date de début"
              minDate={today} 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate" className={styles.label}>Date de fin</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className={styles.input}
              dateFormat="yyyy/MM/dd"
              placeholderText="Sélectionner la date de fin"
              minDate={startDate ? startDate : today} 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>Raison (Facultatif)</label>
            <textarea
              id="reason"
              rows="4"
              className={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <p className={styles.label}>Total des jours demandés : {daysRequested}</p>
            <p className={styles.label}>Dimanches exclus : {sundaysExcluded}</p>
          </div>

          <div className={styles.submitWrapper}>
            <button type="submit" className={styles.submitButton}>
              Soumettre la demande
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveRequestForm;
