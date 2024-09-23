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
      toast.error('Login data not found. Please log in again.');
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
        console.error('Error fetching leave types:', error);
        toast.error('Failed to fetch leave types.');
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
            console.log(`Matching User ID: ${user.id}, Leave Limits:`, user.leaveLimit || {});
            setCheck(user.leaveLimit);
          }
        });
      } catch (error) {
        console.error('Error fetching user leave limits:', error);
        toast.error('Failed to fetch user leave limits.');
      }
    };

    fetchLeaveTypes();
    fetchUserLeaveLimits();
  }, [userId]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      setDaysRequested(days);
    } else {
      setDaysRequested(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (daysRequested > Check) {
      toast.error(`Please apply according to your leave limit. Your limit for leaves was ${Check}.`);
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }
  
    if (endDate < startDate) {
      toast.error('End date must be after start date.');
      return;
    }
  
    const leaveLimit = leaveLimits[leaveType];
    if (leaveLimit !== undefined && daysRequested > leaveLimit) {
      toast.error(`You cannot request more than ${leaveLimit} days of ${leaveType}.`);
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
      toast.success('Leave request submitted successfully!');
  
      setLeaveType('');
      setStartDate(null);
      setEndDate(null);
      setReason('');
    } catch (error) {
      console.error('Error saving leave request to Firebase:', error);
      toast.error('Failed to submit leave request.');
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="leaveType" className={styles.label}>Type of Leave</label>
            <select
              id="leaveType"
              className={styles.select}
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Select type of leave</option>
              {leaveTypes.map(({ id, leaveType }) => (
                <option key={id} value={leaveType}>{leaveType}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate" className={styles.label}>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className={styles.input}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select start date"
              minDate={today} // Allow today as start date
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate" className={styles.label}>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className={styles.input}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select end date"
              minDate={startDate ? startDate : today} // Allow start date or today as end date
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>Reason (Optional)</label>
            <textarea
              id="reason"
              rows="4"
              className={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <p className={styles.label}>Total Days Requested: {daysRequested}</p>
          </div>

          <div className={styles.submitWrapper}>
            <button type="submit" className={styles.submitButton}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveRequestForm;
