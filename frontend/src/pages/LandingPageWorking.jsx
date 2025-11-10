import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'client' });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verify');
    const magicToken = urlParams.get('magic');
    
    if (verifyToken) {
      axios.get(`${API}/auth/verify-email?token=${verifyToken}`)
        .then(() => {
          toast.success('Email verified! You can now login.');
          window.history.replaceState({}, '', '/');
          setShowAuth(true);
        })
        .catch(() => toast.error('Invalid verification link'));
    }
    
    if (magicToken) {
      axios.get(`${API}/auth/magic-login?token=${magicToken}`)
        .then(res => {
          localStorage.setItem('token', res.data.token);
          toast.success('Welcome!');
          window.history.replaceState({}, '', '/');
          navigate(`/${res.data.user.role}`);
          window.location.reload();
        })
        .catch(() => toast.error('Invalid magic link'));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        const user = await login(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate(`/${user.active_role || user.role}`);
      } else {
        // Registration now requires email verification
        const response = await axios.post(`${API}/auth/register`, formData);
        
        // Check if user was auto-logged in or needs verification
        if (response.data.access_token) {
          // User was auto-logged in (shouldn't happen with new verification)
          localStorage.setItem('token', response.data.access_token);
          toast.success('Welcome!');
          navigate(`/${response.data.user.role}`);
          window.location.reload();
        } else {
          // Regular user - show verification message
          setEmailSent(true);
          toast.success(response.data.message || 'Verification email sent! Please check your inbox.');
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || 'Operation failed');
      } else {
        toast.error('Operation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!formData.email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/magic-link`, { email: formData.email, role: formData.role });
      toast.success('Magic link sent!');
      setEmailSent(true);
    } catch (error) {
      toast.error('Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)', position: 'relative', overflow: 'hidden' }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <div style={{ position: 'absolute', top: '5rem', left: '2.5rem', width: '24rem', height: '24rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '9999px', filter: 'blur(64px)' }}></div>
        <div style={{ position: 'absolute', bottom: '5rem', right: '2.5rem', width: '24rem', height: '24rem', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '9999px', filter: 'blur(64px)' }}></div>
      </div>

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '3rem', height: '3rem', background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>✨</span>
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CryptoGig</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Blockchain Freelancing</p>
            </div>
          </div>
          <Button onClick={() => setShowAuth(true)} style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', padding: '0.5rem 2rem' }}>Get Started →</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1rem' }}>✨</span>
            <span style={{ fontSize: '0.875rem', color: '#93c5fd' }}>Decentralized Freelance Platform</span>
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', lineHeight: 1.2, marginBottom: '2rem', color: 'white' }}>
            The Future of <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Freelancing</span>
            <br />
            Powered by <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Blockchain</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '56rem', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            <strong>CryptoGig</strong> revolutionizes freelancing with <strong>stablecoin payments</strong>, <strong>smart contract escrow</strong>, and <strong>zero platform fees</strong>. 
            Get paid instantly in crypto while your funds stay secure until work is completed.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💰</span>
              <span style={{ color: '#93c5fd', fontWeight: '600' }}>Pay in Any Crypto</span>
            </div>
            <div style={{ background: 'rgba(147, 51, 234, 0.1)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🛡️</span>
              <span style={{ color: '#c4b5fd', fontWeight: '600' }}>Smart Contract Security</span>
            </div>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚡</span>
              <span style={{ color: '#67e8f9', fontWeight: '600' }}>Instant Payments</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button onClick={() => { setAuthMode('register'); setShowAuth(true); }} style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              🚀 Get Started
            </Button>
            <Button onClick={() => { setAuthMode('login'); setShowAuth(true); }} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '2px solid rgba(59, 130, 246, 0.3)', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              🔑 Login
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: 'white' }}>How Money Flows <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Securely</span></h2>
        <p style={{ fontSize: '1.125rem', color: '#cbd5e1', textAlign: 'center', marginBottom: '4rem', maxWidth: '48rem', margin: '0 auto 4rem' }}>
          Your funds are protected by smart contracts on Polygon blockchain, ensuring fair and secure transactions
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {[
            { 
              step: '1', 
              icon: '💼', 
              title: 'Client Posts Job', 
              desc: 'Create job and fund escrow with any crypto (ETH, USDC, MATIC, etc.)',
              color: '#3b82f6'
            },
            { 
              step: '2', 
              icon: '🔒', 
              title: 'Smart Contract Holds Funds', 
              desc: 'Money is locked in blockchain escrow - safe from both parties until work is done',
              color: '#8b5cf6'
            },
            { 
              step: '3', 
              icon: '👨‍💻', 
              title: 'Freelancer Delivers', 
              desc: 'Complete the work and submit for review. Client can approve or raise disputes',
              color: '#06b6d4'
            },
            { 
              step: '4', 
              icon: '💰', 
              title: 'Instant Payment', 
              desc: 'Arbitrator releases funds instantly to freelancer\'s wallet in their preferred crypto',
              color: '#10b981'
            },
          ].map((step, i) => (
            <div key={i} style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              backdropFilter: 'blur(16px)', 
              border: `1px solid ${step.color}30`, 
              padding: '2rem', 
              borderRadius: '1.5rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '-1rem',
                left: '1.5rem',
                background: step.color,
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                {step.step}
              </div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'white' }}>{step.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem', color: 'white' }}>Why <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CryptoGig</span>?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {[
            { 
              icon: '🛡️', 
              title: 'Smart Contract Escrow', 
              desc: 'Your money is protected by Polygon blockchain smart contracts. No platform can steal or freeze your funds.',
              highlight: 'Trustless Security'
            },
            { 
              icon: '💰', 
              title: 'Stablecoin Payments', 
              desc: 'Pay and get paid in USDC stablecoin. No more worrying about crypto volatility affecting your earnings.',
              highlight: 'Price Stable'
            },
            { 
              icon: '⚡', 
              title: 'Instant Global Payments', 
              desc: 'Receive payments instantly anywhere in the world. No banks, no delays, no international transfer fees.',
              highlight: 'Borderless'
            },
            { 
              icon: '🔄', 
              title: 'Multi-Crypto Support', 
              desc: 'Clients can pay in ETH, MATIC, or any token. Everything auto-converts to USDC for freelancers.',
              highlight: 'Flexible'
            },
            { 
              icon: '👥', 
              title: 'Team Collaboration', 
              desc: 'Build teams and split payments automatically via smart contracts. Perfect for complex projects.',
              highlight: 'Scalable'
            },
            { 
              icon: '⚖️', 
              title: 'Fair Dispute Resolution', 
              desc: 'Professional arbitrators resolve conflicts fairly. Both parties are protected by transparent rules.',
              highlight: 'Protected'
            },
          ].map((f, i) => (
            <div key={i} style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              backdropFilter: 'blur(16px)', 
              border: '1px solid rgba(148, 163, 184, 0.1)', 
              padding: '2rem', 
              borderRadius: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {f.highlight}
              </div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'white' }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem', color: 'white' }}>
          CryptoGig vs <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Traditional Platforms</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2rem', borderRadius: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fca5a5', textAlign: 'center' }}>❌ Traditional Platforms</h3>
            <ul style={{ color: '#94a3b8', lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
              <li>• 5-20% platform fees</li>
              <li>• 7-14 days payment delays</li>
              <li>• Funds can be frozen</li>
              <li>• Limited to fiat currencies</li>
              <li>• High international transfer fees</li>
              <li>• Platform controls your money</li>
              <li>• Biased dispute resolution</li>
            </ul>
          </div>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '2rem', borderRadius: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#86efac', textAlign: 'center' }}>✅ CryptoGig</h3>
            <ul style={{ color: '#94a3b8', lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
              <li>• 0% platform fees (only 5% arbitrator fee)</li>
              <li>• Instant payments worldwide</li>
              <li>• Your funds, your control</li>
              <li>• Pay/receive in any cryptocurrency</li>
              <li>• No international transfer fees</li>
              <li>• Blockchain-secured transactions</li>
              <li>• Transparent, fair arbitration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', background: 'rgba(15, 23, 42, 0.6)', padding: '4rem', borderRadius: '1.5rem', textAlign: 'center', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>Ready to Start?</h2>
          <p style={{ fontSize: '1.125rem', color: '#cbd5e1', marginBottom: '2rem' }}>Join the future of work with blockchain-secured freelancing.</p>
          <Button onClick={() => setShowAuth(true)} style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', padding: '1rem 3rem', fontSize: '1.125rem' }}>Create Free Account →</Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1e293b', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <span style={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CryptoGig</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>© 2025 CryptoGig. Built on Polygon.</p>
        </div>
      </footer>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome to CryptoGig</DialogTitle>
          </DialogHeader>

          {emailSent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Check your email for the verification link!</p>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>Click the link to verify and login.</p>
              <Button onClick={() => { setEmailSent(false); setAuthMode('login'); }} variant="outline">Back to Login</Button>
            </div>
          ) : (
            <Tabs value={authMode} onValueChange={setAuthMode}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="bg-slate-800 border-slate-700" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="bg-slate-800 border-slate-700" />
                  </div>
                  <Button type="submit" className="w-full" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <div style={{ textAlign: 'center', margin: '1rem 0', color: '#64748b', fontSize: '0.875rem' }}>Or</div>
                  <Button type="button" onClick={handleMagicLink} variant="outline" className="w-full" disabled={loading}>📧 Send Magic Link</Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-slate-800 border-slate-700" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="bg-slate-800 border-slate-700" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="bg-slate-800 border-slate-700" />
                  </div>
                  <Button type="submit" className="w-full" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>You'll start as a client and can switch roles anytime</p>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}