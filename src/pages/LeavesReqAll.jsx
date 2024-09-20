import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LeavesReq = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userId } = location.state || {};

  const handleNavigateToLeaveForm = () => {
    navigate('/leaveform', { state: { role, userId } });
  };

  return (
    // <div>
    //   <h2>Dashboard</h2>
    //   <p>Welcome to the dashboard!</p>
    //   {role && <p>Role: {role}</p>}
    //   {userId && <p>User ID: {userId}</p>}
    //   <button onClick={handleNavigateToLeaveForm}>Go to Leave Form</button>
    // </div>
    <>
    </>
  );
};

export default LeavesReq;
