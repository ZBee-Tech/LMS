import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import Dashboard from './pages/Dashboard';
import LeaveRequestForm from './pages/Leave-req-form'; 
import ForgetPassword from './pages/Forgot';
import LeaveRequestsPage from './pages/LeaveReq';

import './App.css';
import LeaveRequestsPageForHR from './pages/LeaveRequestsPageForHR';
import LeaveRequestsPageForCEO from './pages/LeaveRequestsPageForCEO';
import AddUser from './pages/AddUser';

const Layout = ({ children }) => {
  return (
    <div className="app-container with-sidebar">
      <Header />
      <div className="content-wrapper sidebar-visible">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgetPassword />} />
        <Route path="/addusers" element={<Layout><AddUser/></Layout>} />

        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/leaveform" element={<Layout><LeaveRequestForm /></Layout>} />
        <Route path="/leavesDataHOD" element={<Layout><LeaveRequestsPage /></Layout>} />
        <Route path="/leavesDataHR" element={<Layout><LeaveRequestsPageForHR /></Layout>} />
        <Route path="/leavesDataCEO" element={<Layout><LeaveRequestsPageForCEO /></Layout>} />




      </Routes>
    </Router>
  );
};

export default App;
