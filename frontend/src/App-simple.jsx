import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPageWorking';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ArbitratorDashboard from './pages/ArbitratorDashboard';
import CommunityPage from './pages/CommunityPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/" />;
  
  // Check active_role if it exists, otherwise fallback to role
  const currentRole = user.active_role || user.role;
  
  // Special check for arbitrator - only allow designated email
  if (allowedRole === 'arbitrator' && user.email !== 'devanshgoyal1234@gmail.com') {
    return <Navigate to={`/${currentRole}`} />;
  }
  
  // If an allowedRole is specified and user doesn't match, redirect to their dashboard
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={`/${currentRole}`} />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/client" element={<ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>} />
          <Route path="/freelancer" element={<ProtectedRoute allowedRole="freelancer"><FreelancerDashboard /></ProtectedRoute>} />
          <Route path="/arbitrator" element={<ProtectedRoute allowedRole="arbitrator"><ArbitratorDashboard /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;