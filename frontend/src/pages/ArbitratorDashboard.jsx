import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


import axios from 'axios';
import { toast } from 'sonner';
import {
  Shield,
  LogOut,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Users,
  Briefcase,
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function ArbitratorDashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState({});
  const [showResolve, setShowResolve] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolution, setResolution] = useState({
    client_percentage: 0,
    freelancer_percentage: 100,
    resolution: '',
  });
  const [showRelease, setShowRelease] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchDisputes();
    fetchStats();
  }, []);

  

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`);
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
  };

  const fetchDisputes = async () => {
    try {
      const response = await axios.get(`${API}/disputes`);
      setDisputes(response.data);
    } catch (error) {
      toast.error('Failed to fetch disputes');
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

  const handleReleaseFunds = async (jobId) => {
    setLoading(true);
    try {
      // Find the job to get details
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        toast.info(`Releasing ${job.budget_usdc} USDC to freelancer`);
        toast.info(`Arbitrator fee: ${(job.budget_usdc * 0.05).toFixed(2)} USDC (5%)`);
        toast.info(`Freelancer receives: ${(job.budget_usdc * 0.95).toFixed(2)} USDC (95%)`);
      }
      
      await axios.post(`${API}/jobs/${jobId}/release`, { tx_hash: 'pending' });
      toast.success('✅ Funds released successfully!');
      toast.success('💰 Freelancer has been paid!');
      toast.success('🎉 Arbitrator fee earned!');
      
      fetchJobs();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to release funds');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find the job to calculate amounts
      const job = jobs.find(j => j.id === selectedDispute.job_id);
      if (job) {
        const arbitratorFee = job.budget_usdc * 0.08; // 8% for disputes
        const remainingAmount = job.budget_usdc - arbitratorFee;
        const clientAmount = (remainingAmount * resolution.client_percentage) / 100;
        const freelancerAmount = (remainingAmount * resolution.freelancer_percentage) / 100;
        
        toast.info(`Resolving dispute for ${job.budget_usdc} USDC`);
        toast.info(`Arbitrator fee: ${arbitratorFee.toFixed(2)} USDC (8% for dispute)`);
        toast.info(`Client receives: ${clientAmount.toFixed(2)} USDC (${resolution.client_percentage}%)`);
        toast.info(`Freelancer receives: ${freelancerAmount.toFixed(2)} USDC (${resolution.freelancer_percentage}%)`);
      }
      
      await axios.post(`${API}/disputes/${selectedDispute.id}/resolve`, {
        ...resolution,
        tx_hash: 'pending',
      });
      
      toast.success('✅ Dispute resolved successfully!');
      toast.success('💰 Funds distributed according to decision!');
      toast.success('🎉 Arbitrator dispute fee earned!');
      
      setShowResolve(false);
      setSelectedDispute(null);
      setResolution({ client_percentage: 0, freelancer_percentage: 100, resolution: '' });
      fetchDisputes();
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to resolve dispute');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      created: { class: 'status-created', text: 'Open' },
      in_progress: { class: 'status-in-progress', text: 'In Progress' },
      completed: { class: 'status-completed', text: 'Awaiting Release' },
      disputed: { class: 'status-disputed', text: 'Disputed' },
      resolved: { class: 'status-resolved', text: 'Resolved' },
    };
    const badge = badges[status] || badges.created;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  const completedJobs = jobs.filter(job => job.status === 'completed');
  const disputedJobs = jobs.filter(job => job.status === 'disputed');
  const pendingDisputes = disputes.filter(d => d.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900" data-testid="arbitrator-dashboard">
      {/* Header */}
      <div className="glass-effect border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CryptoGig</h1>
                <p className="text-sm text-slate-400">Arbitrator Dashboard</p>
                {user?.wallet_address?.toLowerCase() === '0x6a413e4c59cfb5d4544d5eca74dacf7848b3a483' && (
                  <p className="text-xs text-green-400">✅ Authorized Wallet</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
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
              <div className="text-3xl font-bold text-purple-400">{stats.total_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 bg-slate-900/50" data-testid="stat-pending-disputes">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.pending_disputes || 0}</div>
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
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="glass-effect bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="pending" data-testid="tab-pending-releases">
              <CheckCircle className="w-4 h-4 mr-2" />
              Pending Releases ({completedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="disputes" data-testid="tab-disputes">
              <AlertCircle className="w-4 h-4 mr-2" />
              Disputes ({pendingDisputes.length})
            </TabsTrigger>
            <TabsTrigger value="all" data-testid="tab-all-jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              All Jobs
            </TabsTrigger>
          </TabsList>

          {/* Pending Fund Releases */}
          <TabsContent value="pending" className="space-y-4">
            {completedJobs.length === 0 ? (
              <Card className="glass-effect border-slate-700 bg-slate-900/50">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No jobs waiting for fund release</p>
                </CardContent>
              </Card>
            ) : (
              completedJobs.map((job) => (
                <Card key={job.id} className="glass-effect border-slate-700 bg-slate-900/50 card-hover" data-testid={`release-job-${job.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-slate-400">{job.description}</CardDescription>
                        <div className="flex gap-4 mt-3 text-sm">
                          <span className="text-slate-500">Client: <span className="text-slate-300">{job.client_id.slice(0, 8)}...</span></span>
                          <span className="text-slate-500">Freelancer: <span className="text-slate-300">{job.freelancer_id?.slice(0, 8)}...</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(job.status)}
                        <div className="mt-2 text-2xl font-bold text-cyan-400">${job.budget_usdc}</div>
                        <div className="text-xs text-slate-500">USDC</div>
                        <div className="text-xs text-green-400 mt-1">Fee: ${(job.budget_usdc * 0.05).toFixed(2)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <div className="text-sm text-slate-400">
                        Freelancer completed the work
                      </div>
                      <Button
                        onClick={() => handleReleaseFunds(job.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        disabled={loading}
                        data-testid={`release-funds-btn-${job.id}`}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Release Funds
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Disputes */}
          <TabsContent value="disputes" className="space-y-4">
            {pendingDisputes.length === 0 ? (
              <Card className="glass-effect border-slate-700 bg-slate-900/50">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No pending disputes</p>
                </CardContent>
              </Card>
            ) : (
              pendingDisputes.map((dispute) => {
                const job = jobs.find(j => j.id === dispute.job_id);
                return (
                  <Card key={dispute.id} className="glass-effect border-red-900/30 bg-slate-900/50 card-hover" data-testid={`dispute-${dispute.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 text-red-400">Dispute: {job?.title}</CardTitle>
                          <CardDescription className="text-slate-400 mb-3">{dispute.reason}</CardDescription>
                          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-200">
                              <AlertCircle className="w-4 h-4 inline mr-2" />
                              Raised by: {dispute.raised_by.slice(0, 8)}...
                            </p>
                          </div>
                          {job && (
                            <div className="flex gap-4 text-sm">
                              <span className="text-slate-500">Client: <span className="text-slate-300">{job.client_id.slice(0, 8)}...</span></span>
                              <span className="text-slate-500">Freelancer: <span className="text-slate-300">{job.freelancer_id?.slice(0, 8)}...</span></span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-400">${job?.budget_usdc}</div>
                          <div className="text-xs text-slate-500">USDC</div>
                          <div className="text-xs text-amber-400 mt-1">Fee: ${(job?.budget_usdc * 0.08).toFixed(2)}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div className="text-sm text-amber-300">
                          Review and resolve the dispute fairly
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setShowResolve(true);
                          }}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                          data-testid={`resolve-dispute-btn-${dispute.id}`}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Resolve Dispute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* All Jobs */}
          <TabsContent value="all" className="space-y-4">
            {jobs.length === 0 ? (
              <Card className="glass-effect border-slate-700 bg-slate-900/50">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No jobs in the system</p>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="glass-effect border-slate-700 bg-slate-900/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                        <CardDescription className="text-sm text-slate-500">{job.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(job.status)}
                        <div className="text-lg font-bold text-cyan-400 mt-1">${job.budget_usdc}</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Resolve Dispute Dialog */}
      <Dialog open={showResolve} onOpenChange={setShowResolve}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700" data-testid="resolve-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Resolve Dispute</DialogTitle>
            <DialogDescription className="text-slate-400">
              Decide how to split the funds between client and freelancer
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResolveDispute} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-percentage">Client %</Label>
                <Input
                  id="client-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={resolution.client_percentage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setResolution({
                      ...resolution,
                      client_percentage: val,
                      freelancer_percentage: 100 - val,
                    });
                  }}
                  className="bg-slate-800 border-slate-700"
                  data-testid="client-percentage-input"
                />
              </div>
              <div>
                <Label htmlFor="freelancer-percentage">Freelancer %</Label>
                <Input
                  id="freelancer-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={resolution.freelancer_percentage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setResolution({
                      ...resolution,
                      freelancer_percentage: val,
                      client_percentage: 100 - val,
                    });
                  }}
                  className="bg-slate-800 border-slate-700"
                  data-testid="freelancer-percentage-input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Explain your decision..."
                value={resolution.resolution}
                onChange={(e) => setResolution({ ...resolution, resolution: e.target.value })}
                required
                rows={4}
                className="bg-slate-800 border-slate-700"
                data-testid="resolution-notes-input"
              />
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-purple-200">
                <Shield className="w-4 h-4 inline mr-2" />
                You'll receive 8% of the total budget as arbitration fee
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              disabled={loading}
              data-testid="submit-resolution-btn"
            >
              {loading ? 'Resolving...' : 'Resolve Dispute'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}