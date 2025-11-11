import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Briefcase, Shield, ArrowRight, Sparkles, Users, Zap, CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for verification token
    const verifyToken = urlParams.get('verify');
    if (verifyToken) {
      verifyEmail(verifyToken);
    }
    
    // Check for magic link token
    const magicToken = urlParams.get('magic');
    if (magicToken) {
      handleMagicLogin(magicToken);
    }
  }, []);

  const handleMagicLogin = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/magic-login?token=${token}`);
      localStorage.setItem('token', response.data.token);
      toast.success('Welcome to CryptoGig!');
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate(`/${response.data.user.role}`);
      window.location.reload();
    } catch (error) {
      toast.error('Invalid or expired magic link');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/verify-email?token=${token}`);
      toast.success('Email verified! You can now login.');
      window.history.replaceState({}, document.title, window.location.pathname);
      setShowAuth(true);
      setAuthMode('login');
    } catch (error) {
      toast.error('Invalid or expired verification link');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'login') {
        const user = await login(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate(`/${user.role}`);
      } else {
        // Register instantly without email verification
        const user = await register(formData.email, formData.password, formData.name, formData.role);
        toast.success('Account created successfully!');
        navigate(`/${user.role}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/auth/magic-link`, {
        email: formData.email,
        role: formData.role
      });
      toast.success('Magic link sent to your email!');
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 crypto-grid opacity-10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-50"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text">CryptoGig</span>
              <p className="text-xs text-slate-500">Blockchain Freelancing</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAuth(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-8 shadow-lg shadow-blue-500/20"
            data-testid="get-started-btn"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </nav>

      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-effect text-sm text-blue-300 mb-4 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Decentralized Freelance Platform</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="text-white">Build Your</span>
              <br />
              <span className="gradient-text">Dream Team</span>
              <br />
              <span className="text-white">Pay in</span> <span className="gradient-text">Crypto</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Decentralized freelance platform with blockchain escrow, team collaboration, and skill-based communities.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => {
                  setAuthMode('register');
                  setFormData({ ...formData, role: 'client' });
                  setShowAuth(true);
                }}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-10 py-6 text-lg shadow-xl shadow-blue-500/30"
                data-testid="client-signup-btn"
              >
                <Briefcase className="mr-2 w-6 h-6" />
                I'm a Client
              </Button>
              <Button
                onClick={() => {
                  setAuthMode('register');
                  setFormData({ ...formData, role: 'freelancer' });
                  setShowAuth(true);
                }}
                size="lg"
                className="bg-slate-800/50 border-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50 px-10 py-6 text-lg"
                data-testid="freelancer-signup-btn"
              >
                <Users className="mr-2 w-6 h-6" />
                I'm a Freelancer
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How <span className="gradient-text">It Works</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">From hiring to payment - secured by blockchain</p>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-6">
          {[
            { step: 1, title: 'Post Your Job', desc: 'Create job listings with budget and requirements. Funds locked in smart contract escrow.', icon: Briefcase },
            { step: 2, title: 'Find Perfect Match', desc: 'Browse freelancer profiles with portfolios, GitHub projects, and ratings.', icon: Users },
            { step: 3, title: 'Build Your Team', desc: 'Invite collaborators and split profits automatically through smart contracts.', icon: Zap },
            { step: 4, title: 'Get Paid Instantly', desc: 'Work verified, funds released to wallet. Withdraw in any crypto.', icon: CheckCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="glass-effect p-8 rounded-3xl flex items-start gap-8 border border-slate-700/50">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <Icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">STEP {item.step}</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                  <p className="text-slate-400 text-lg">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">Why <span className="gradient-text">CryptoGig</span>?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Shield, title: 'Smart Escrow', desc: 'Funds locked in blockchain. Released only after work approval.' },
            { icon: Users, title: 'Multi-Crypto', desc: 'Pay in any token. Auto-converts to USDC. Zero hassle.' },
            { icon: Zap, title: 'Build Teams', desc: 'Invite collaborators. Split profits automatically.' },
            { icon: Users, title: 'Communities', desc: 'Join skill-based channels. Network with professionals.' },
            { icon: CheckCircle, title: 'Instant Pay', desc: 'Work verified? Get paid instantly to your wallet.' },
            { icon: Shield, title: 'Fair Disputes', desc: 'Arbitration system ensures fair resolution.' },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-effect p-8 rounded-3xl border border-slate-700/50">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5 border border-blue-500/20">
                  <Icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto glass-effect p-12 rounded-3xl border border-slate-700/50 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-slate-300 text-lg mb-8">Join the future of work. Hire talent, build teams, and transact securely.</p>
          <Button
            onClick={() => setShowAuth(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-12 py-6 text-lg shadow-xl"
          >
            Create Free Account <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold gradient-text">CryptoGig</span>
            </div>
            <p className="text-slate-500 text-sm">© 2025 CryptoGig. Built on Polygon.</p>
          </div>
        </div>
      </footer>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Welcome to CryptoGig</DialogTitle>
            <DialogDescription className="text-slate-400">
              {emailSent ? 'Check your email for verification link' : (authMode === 'login' ? 'Sign in to your account' : 'Create your account')}
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-4">We've sent a verification link to your email.</p>
              <p className="text-sm text-slate-500">Click the link to verify your account and login.</p>
              <Button
                onClick={() => {
                  setEmailSent(false);
                  setAuthMode('login');
                }}
                variant="outline"
                className="mt-6 border-slate-700"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <Tabs value={authMode} onValueChange={setAuthMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-slate-900 px-2 text-slate-500">Or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleMagicLink}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300"
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Magic Link
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-role">I am a</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                  <p className="text-xs text-slate-500 text-center">A verification link will be sent to your email</p>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}