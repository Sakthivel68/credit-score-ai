import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LoanForm from './pages/LoanForm';
import Result from './pages/Result';
import History from './pages/History';

// ==============================
// App Component — Main Router
// ==============================
const App = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 20px' }}>
        <div className="container">
          <Routes>
            {/* Loan Application Form */}
            <Route path="/" element={<LoanForm />} />

            {/* Prediction Result Page */}
            <Route path="/result" element={<Result />} />

            {/* Prediction History Page */}
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
};

export default App;