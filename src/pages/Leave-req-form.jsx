import React, { useState } from 'react';
import styles from '../assets/CSS/LeaveRequestForm.module.css'; 

const LeaveRequestForm = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      leaveType,
      startDate,
      endDate,
      reason
    });
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
            <input 
              type="date" 
              id="startDate"
              className={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate" className={styles.label}>End Date</label>
            <input 
              type="date" 
              id="endDate"
              className={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
    </div>
  );
};

export default LeaveRequestForm;
