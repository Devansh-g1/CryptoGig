import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPageWorking';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ArbitratorDashboard from './pages/ArbitratorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CommunityPage from './pages/CommunityPage';
import VerifyEmail from './pages/VerifyEmail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

// Suppress wallet-related errors in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    const errorStr = String(args[0] || '');
    if (errorStr.includes('WalletConnect') || 
        errorStr.includes('Connection interrupted') ||
        errorStr.includes('runtime.sendMessage') ||
        errorStr.includes('Extension ID')) {
      return; // Suppress wallet-related errors
    }
    originalError.apply(console, args);
  };
  
  // Also suppress runtime errors
  window.addEventListener('error', (e) => {
    const errorStr = String(e.message || '');
    if (errorStr.includes('runtime.sendMessage') || 
        errorStr.includes('Extension ID') ||
        errorStr.includes('WalletConnect')) {
      e.preventDefault();
      return false;
    }
  });
}

const queryClient = new QueryClient();

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
  
  // Special check for arbitrator - allow designated email OR wallet address
  if (allowedRole === 'arbitrator') {
    const isArbitratorEmail = user.email === 'devanshgoyal1234@gmail.com';
    const isArbitratorWallet = user.wallet_address?.toLowerCase() === '0x6a413e4c59cfb5d4544d5eca74dacf7848b3a483';
    
    if (!isArbitratorEmail && !isArbitratorWallet) {
      return <Navigate to={`/${currentRole}`} />;
    }
  }
  
  // If an allowedRole is specified and user doesn't match, redirect to their dashboard
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={`/${currentRole}`} />;
  }
  
  return children;
}

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/client" element={<ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>} />
                <Route path="/freelancer" element={<ProtectedRoute allowedRole="freelancer"><FreelancerDashboard /></ProtectedRoute>} />
                <Route path="/arbitrator" element={<ProtectedRoute allowedRole="arbitrator"><ArbitratorDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
