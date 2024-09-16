 import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import Dashboard from './pages/Dashboard';
import './App.css';  // Global styles

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
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
