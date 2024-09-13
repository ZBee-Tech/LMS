import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
 import LoginPage from './pages/login';
 
const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            
            <Route path="/login" element={<LoginPage />} />
           </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
