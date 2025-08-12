import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome to the Dashboard!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
