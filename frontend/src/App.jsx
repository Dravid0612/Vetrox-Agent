import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginGateway from './pages/LoginGateway'; // Import the new file
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Simple component to conditionally show a "Back to Home" button
const Navigation = () => {
  const location = useLocation();
  if (location.pathname === '/') return null; // Don't show on login page
  
  return (
    <nav className="bg-black p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 z-50">
      <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        VETROX
      </span>
      <a href="/" className="text-xs text-gray-500 hover:text-white transition">LOGOUT / SWITCH ROLE</a>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-mono">
        <Navigation />
        <Routes>
          <Route path="/" element={<LoginGateway />} /> {/* Start here */}
          <Route path="/user" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;