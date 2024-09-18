import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  
import styles from '../assets/CSS/LeaveRequestForm.module.css';
import { db } from '../firebase-config';   
import { collection, addDoc } from 'firebase/firestore';   

const LeaveRequestForm = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);  
  const [endDate, setEndDate] = useState(null);  
  const [reason, setReason] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');  // New state for username

  const today = new Date();

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUserId = localStorage.getItem('userId');
    const savedFullName = localStorage.getItem('fullName');  // Retrieve username
    
    if (savedRole && savedUserId && savedFullName) {
      setRole(savedRole);
      setUserId(savedUserId);
      setFullName(savedFullName);  // Set username state
    } else {
      toast.error('Login data not found. Please log in again.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }
  
    if (startDate < today) {
      toast.error('Start date cannot be in the past.');
      return;
    }
  
    if (endDate < startDate) {
      toast.error('End date must be after start date.');
      return;
    }
  
    toast.success('Leave request submitted successfully!');
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
      ApprovedbyHOD: null,
      ApprovedbyHR:null,
      ApprovedByCEO:null   
    };
  
    try {
      await addDoc(collection(db, 'leaveRequests'), leaveRequestData);
      console.log('Leave request saved to Firebase');
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
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
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
              minDate={today}  
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
              minDate={startDate ? startDate : today}  
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
