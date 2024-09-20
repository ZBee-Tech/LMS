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
import ProtectedRoute from './components/ProtectedRoute';  
import UpdateProfile from './pages/UpdateProfile';   
import AddHOD from './pages/AddHOD.jsx';   
import LeaveOverview from './pages/LeaveOverview';   
import LeavesReq from './pages/LeavesReqAll.jsx';   


import './App.css';
import LeaveRequestsPageForHR from './pages/LeaveRequestsPageForHR';
import LeaveRequestsPageForCEO from './pages/LeaveRequestsPageForCEO';
import AddUser from './pages/AddUser';
import AddLeaveType from './pages/LeaveTypeManager.jsx';
import HomeHR from './pages/DashboardHR.jsx'; 
import CEODashboard from './pages/CEODashboard.jsx';
import AdminDashboard from './pages/AdministatorHome.jsx';
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

         <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/addusers" element={<Layout><AddUser/></Layout>} />
          <Route path="/update-profile" element={<Layout><UpdateProfile /></Layout>} />  
          <Route path="/AddHOD" element={<Layout><AddHOD /></Layout>} />
          <Route path="/addleavetype" element={<Layout><AddLeaveType /></Layout>} />
          <Route path="/leaveoverview" element={<Layout><LeaveOverview /></Layout>} />
          <Route path="/homehr" element={<Layout><HomeHR/></Layout>} />
          <Route path="/ceohome" element={<Layout><CEODashboard/></Layout>} />
          <Route path="/adminhome" element={<Layout><AdminDashboard/></Layout>} />
          <Route path="/leavereqsall" element={<Layout><LeavesReq/></Layout>} />

          <Route path="/leaveform" element={<Layout><LeaveRequestForm /></Layout>} />
          <Route path="/leavesDataHOD" element={<Layout><LeaveRequestsPage /></Layout>} />
          <Route path="/leavesDataHR" element={<Layout><LeaveRequestsPageForHR /></Layout>} />
          <Route path="/leavesDataCEO" element={<Layout><LeaveRequestsPageForCEO /></Layout>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
