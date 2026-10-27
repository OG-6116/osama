import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import SimulatorPage from './pages/SimulatorPage.js';
import ComparisonPage from './pages/ComparisonPage.js';
import GuidePage from './pages/GuidePage.js';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SimulatorPage />} />
            <Route path="/simulator" element={<Navigate to="/" replace />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer style={{
          borderTop: '1px solid var(--border-color)',
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.8rem',
          backgroundColor: 'rgba(11, 15, 25, 0.6)',
        }}>
          OS Process Scheduling Animated Simulator • Built with React & React Router DOM
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
