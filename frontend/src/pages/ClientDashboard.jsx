import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import SimpleWalletConnect from '../components/SimpleWalletConnect';
import { useFundJob } from '../hooks/useFundJob';
import {
  Plus,
  Briefcase,
  DollarSign,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  Search,
  MessageSquare,
  Wallet,
} from 'lucide-react';
import RoleSwitcher from '../components/RoleSwitcher';
import ProfileModal from '../components/ProfileModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function ClientDashboard() {
  const { user, logout, refreshUser, linkWallet } = useAuth();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { fundJob, isLoading: isFunding } = useFundJob();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_usdc: '',
    required_skills: '',
  });
  const [disputeReason, setDisputeReason] = useState('');

  useEffect(() => {
    refreshUser(); // Refresh user data on mount
    fetchJobs();
    fetchStats();
  }, []);

  useEffect(() => {
    // Auto-link wallet when connected
    if (isConnected && address && user && address !== user.wallet_address) {
      linkWallet(address);
      toast.success('Wallet connected!');
    }
  }, [isConnected, address, user]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`);
      setJobs(response.data.jobs || response.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
      // Don't show error toast on initial load
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Stats endpoint might not exist, set defaults
      setStats({
        total_jobs: 0,
        active_jobs: 0,
        completed_jobs: 0,
        total_spent: 0
      });
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const skills = formData.required_skills
        ? formData.required_skills.split(',').map((s) => s.trim()).filter(s => s)
        : [];
      
      // Create job in database (status: PENDING_PAYMENT)
      const response = await axios.post(`${API}/jobs`, {
        title: formData.title,
        description: formData.description,
        budget_usdc: parseFloat(formData.budget_usdc),
        required_skills: skills,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newJob = response.data;
      setShowCreateJob(false);
      setFormData({ title: '', description: '', budget_usdc: '', required_skills: '' });
      
      // Show payment instructions
      toast.success('Job created! Now transfer funds to arbitrator to activate.');
      toast.info(`Send ${formData.budget_usdc} USDC to: ${ARBITRATOR_WALLET.slice(0,10)}...`, {
        duration: 10000
      });
      
      fetchJobs();
      fetchStats();
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || 'Failed to create job');
      } else {
        toast.error('Failed to create job');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseDispute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/disputes`, {
        job_id: selectedJob.id,
        reason: disputeReason,
      });
      toast.success('Dispute raised successfully');
      setShowDispute(false);
      setDisputeReason('');
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || 'Failed to raise dispute');
      } else {
        toast.error('Failed to raise dispute');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      created: { class: 'status-created', icon: Clock, text: 'Open' },
      in_progress: { class: 'status-in-progress', icon: Clock, text: 'In Progress' },
      completed: { class: 'status-completed', icon: CheckCircle, text: 'Completed' },
      disputed: { class: 'status-disputed', icon: AlertCircle, text: 'Disputed' },
      resolved: { class: 'status-resolved', icon: CheckCircle, text: 'Resolved' },
    };
    const badge = badges[status] || badges.created;
    const Icon = badge.icon;
    return (
      <span className={`status-badge ${badge.class}`}>
        <Icon className="w-3 h-3" /> {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" data-testid="client-dashboard">
      {/* Header */}
      <div className="glass-effect border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CryptoGig</h1>
                <p className="text-sm text-slate-400">Client Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RoleSwitcher currentRole={user?.active_role || user?.role} onRoleChange={(newRole) => window.location.href = `/${newRole}`} />
              <SimpleWalletConnect />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/community')}
                className="border-slate-700 text-slate-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Community
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(true)}
                className="border-slate-700 text-slate-300"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-300 hover:text-white"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-slate-700 bg-slate-900/50" data-testid="stat-total-jobs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{stats.total_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 bg-slate-900/50" data-testid="stat-active-jobs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-400">{stats.active_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono text-slate-300">
                {user?.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : 'Not connected'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Jobs</h2>
          <Button
            onClick={() => setShowCreateJob(true)}
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
            data-testid="create-job-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="glass-effect border-slate-700 bg-slate-900/50">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No jobs yet. Create your first job to get started!</p>
                <Button
                  onClick={() => setShowCreateJob(true)}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-300"
                >
                  Create Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="glass-effect border-slate-700 bg-slate-900/50 card-hover" data-testid={`job-card-${job.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-slate-400">{job.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(job.status)}
                      <div className="mt-2 text-2xl font-bold text-cyan-400">${job.budget_usdc}</div>
                      <div className="text-xs text-slate-500">USDC</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400">
                      {job.freelancer_id ? (
                        <span className="text-green-400">Freelancer assigned</span>
                      ) : (
                        <span>Waiting for freelancer</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {(job.status === 'pending_payment' || job.status === 'created') && isConnected && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowFundDialog(true);
                          }}
                          disabled={isFunding}
                        >
                          💰 {isFunding ? 'Funding...' : 'Fund Job'}
                        </Button>
                      )}
                      {(job.status === 'pending_payment' || job.status === 'created') && !isConnected && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/50 text-blue-300"
                          onClick={() => toast.info('Connect your wallet to fund this job')}
                        >
                          🦊 Connect Wallet to Fund
                        </Button>
                      )}
                      {(job.status === 'in_progress' || job.status === 'completed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDispute(true);
                          }}
                          data-testid={`raise-dispute-btn-${job.id}`}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Raise Dispute
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Job Dialog */}
      <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700" data-testid="create-job-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Create New Job</DialogTitle>
            <DialogDescription className="text-slate-400">
              Post a job and fund it with crypto via smart contract
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="Build a landing page"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-slate-800 border-slate-700"
                data-testid="job-title-input"
              />
            </div>
            <div>
              <Label htmlFor="job-description">Description</Label>
              <Textarea
                id="job-description"
                placeholder="Detailed project requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="bg-slate-800 border-slate-700"
                data-testid="job-description-input"
              />
            </div>
            <div>
              <Label htmlFor="job-budget">Budget (USDC)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="job-budget"
                  type="number"
                  step="0.01"
                  placeholder="100"
                  value={formData.budget_usdc}
                  onChange={(e) => setFormData({ ...formData, budget_usdc: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 pl-9"
                  data-testid="job-budget-input"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                5% arbitrator fee will be deducted (8% if disputed)
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
              disabled={loading}
              data-testid="submit-job-btn"
            >
              {loading ? 'Creating...' : 'Create Job'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Raise Dispute Dialog */}
      <Dialog open={showDispute} onOpenChange={setShowDispute}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700" data-testid="dispute-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-400">Raise Dispute</DialogTitle>
            <DialogDescription className="text-slate-400">
              Explain the issue with this job. Arbitrator will review and resolve.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRaiseDispute} className="space-y-4">
            <div>
              <Label htmlFor="dispute-reason">Reason for Dispute</Label>
              <Textarea
                id="dispute-reason"
                placeholder="Explain the issue in detail..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                required
                rows={5}
                className="bg-slate-800 border-slate-700"
                data-testid="dispute-reason-input"
              />
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-sm text-amber-200">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Dispute fee: 8% of project budget
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
              data-testid="submit-dispute-btn"
            >
              {loading ? 'Submitting...' : 'Raise Dispute'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Fund Job Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Fund Job with USDC</DialogTitle>
            <DialogDescription className="text-slate-400">
              Transfer USDC to escrow contract on Sepolia testnet
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Job:</span>
                  <span className="font-semibold">{selectedJob.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-2xl font-bold text-cyan-400">${selectedJob.budget_usdc} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Platform Fee (5%):</span>
                  <span className="text-amber-400">${(selectedJob.budget_usdc * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Dispute Fee (if raised):</span>
                  <span className="text-red-400">+3% (total 8%)</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  ℹ️ Make sure you have USDC on Sepolia testnet. Get test USDC from faucets.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={async () => {
                    const success = await fundJob(selectedJob.id, selectedJob.budget_usdc);
                    if (success) {
                      setShowFundDialog(false);
                      setSelectedJob(null);
                      fetchJobs();
                      fetchStats();
                    }
                  }}
                  disabled={isFunding}
                >
                  {isFunding ? 'Processing...' : '💰 Fund Now'}
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700"
                  onClick={() => {
                    setShowFundDialog(false);
                    setSelectedJob(null);
                  }}
                  disabled={isFunding}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onUpdate={() => {
          fetchJobs();
          fetchStats();
        }}
      />
    </div>
  );
}