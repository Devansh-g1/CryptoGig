import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';


import axios from 'axios';
import { toast } from 'sonner';
import {
  Briefcase,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  MessageSquare,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import RoleSwitcher from '../components/RoleSwitcher';
import ProfileModal from '../components/ProfileModal';
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

export default function FreelancerDashboard() {
  const { user, logout, refreshUser, linkWallet } = useAuth();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [showDispute, setShowDispute] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleAcceptJob = async (jobId) => {
    setLoading(true);
    try {
      await axios.post(`${API}/jobs/${jobId}/accept`, {});
      toast.success('Job accepted! Start working on it.');
      fetchJobs();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to accept job');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (jobId) => {
    setLoading(true);
    try {
      await axios.post(`${API}/jobs/${jobId}/complete`, {});
      toast.success('Job marked as completed! Waiting for arbitrator approval.');
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to complete job');
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
      toast.error(error.response?.data?.detail || 'Failed to raise dispute');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      created: { class: 'status-created', icon: Clock, text: 'Available' },
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

  const myJobs = jobs.filter(job => job.freelancer_id === user?.id);
  const availableJobs = jobs.filter(job => job.status === 'created');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" data-testid="freelancer-dashboard">
      {/* Header */}
      <div className="glass-effect border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CryptoGig</h1>
                <p className="text-sm text-slate-400">Freelancer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RoleSwitcher currentRole={user?.active_role || user?.role} onRoleChange={(newRole) => window.location.href = `/${newRole}`} />
              <ConnectButton chainStatus="icon" showBalance={false} />
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
              <CardTitle className="text-sm font-medium text-slate-400">My Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{stats.total_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 bg-slate-900/50" data-testid="stat-completed-jobs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.completed_jobs || 0}</div>
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

        {/* Available Jobs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-cyan-400" />
            Available Jobs
          </h2>
          <div className="space-y-4">
            {availableJobs.length === 0 ? (
              <Card className="glass-effect border-slate-700 bg-slate-900/50">
                <CardContent className="py-12 text-center">
                  <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No available jobs at the moment. Check back later!</p>
                </CardContent>
              </Card>
            ) : (
              availableJobs.map((job) => (
                <Card key={job.id} className="glass-effect border-slate-700 bg-slate-900/50 card-hover" data-testid={`available-job-${job.id}`}>
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
                        Posted by client
                      </div>
                      <Button
                        onClick={() => handleAcceptJob(job.id)}
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
                        disabled={loading}
                        data-testid={`accept-job-btn-${job.id}`}
                      >
                        Accept Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* My Active Jobs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Active Jobs</h2>
          <div className="space-y-4">
            {myJobs.length === 0 ? (
              <Card className="glass-effect border-slate-700 bg-slate-900/50">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No active jobs. Accept a job from available listings!</p>
                </CardContent>
              </Card>
            ) : (
              myJobs.map((job) => (
                <Card key={job.id} className="glass-effect border-slate-700 bg-slate-900/50 card-hover" data-testid={`my-job-${job.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-slate-400">{job.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(job.status)}
                        <div className="mt-2 text-2xl font-bold text-cyan-400">${job.budget_usdc}</div>
                        <div className="text-xs text-slate-500">USDC (95% after fee)</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <div className="text-sm text-slate-400">
                        {job.status === 'resolved' && <span className="text-green-400">Payment released</span>}
                        {job.status === 'completed' && <span className="text-yellow-400">Waiting for approval</span>}
                        {job.status === 'disputed' && <span className="text-red-400">Under dispute</span>}
                      </div>
                      <div className="flex gap-2">
                        {job.status === 'in_progress' && (
                          <>
                            <Button
                              onClick={() => handleCompleteJob(job.id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={loading}
                              data-testid={`complete-job-btn-${job.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                            <Button
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
                          </>
                        )}
                        {job.status === 'completed' && (
                          <Button
                            variant="outline"
                            className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDispute(true);
                            }}
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
      </div>

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
                Arbitrator will review both sides and make a fair decision.
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