import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const { role, userId } = location.state || {};

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      {role && <p>Role: {role}</p>}
      {userId && <p>User ID: {userId}</p>}
    </div>
  );
};

export default Dashboard;
