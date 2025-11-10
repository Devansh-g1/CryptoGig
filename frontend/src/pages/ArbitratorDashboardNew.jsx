import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Shield,
  Briefcase,
  DollarSign,
  LogOut,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import RoleSwitcher from '../components/RoleSwitcher';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function ArbitratorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState({ decision: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.email !== 'devanshgoyal1234@gmail.com') {
      toast.error('Access denied: Arbitrator only');
      navigate('/');
      return;
    }
    fetchDisputes();
    fetchAllJobs();
    fetchStats();
  }, [user, navigate]);

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/arbitrator/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(response.data.disputes || []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      setDisputes([]);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/arbitrator/all-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setAllJobs([]);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/arbitrator/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({});
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/arbitrator/resolve-dispute/${selectedDispute.id}`,
        resolution,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Dispute resolved successfully!');
      setShowResolveDialog(false);
      setResolution({ decision: '', notes: '' });
      fetchDisputes();
      fetchAllJobs();
      fetchStats();
    } catch (error) {
      toast.error('Failed to resolve dispute');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Arbitrator Dashboard</h1>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RoleSwitcher currentRole={user?.active_role || 'arbitrator'} />
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Active Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{stats.disputed_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.resolved_jobs || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total Escrow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">${stats.total_escrow || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Arbitrator Wallet */}
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Wallet className="w-5 h-5" />
              Arbitrator Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 font-mono text-sm break-all">
              {stats.arbitrator_wallet || ARBITRATOR_WALLET}
            </p>
          </CardContent>
        </Card>

        {/* Disputes */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Active Disputes
            </CardTitle>
            <CardDescription>Jobs requiring arbitration</CardDescription>
          </CardHeader>
          <CardContent>
            {disputes.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No active disputes</p>
            ) : (
              <div className="space-y-4">
                {disputes.map((job) => (
                  <Card key={job.id} className="bg-slate-900/50 border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>Budget: ${job.budget}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4">{job.description}</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedDispute(job);
                            setShowResolveDialog(true);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve Dispute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Jobs */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              All Jobs
            </CardTitle>
            <CardDescription>Monitor all platform jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {allJobs.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No jobs yet</p>
            ) : (
              <div className="space-y-4">
                {allJobs.map((job) => (
                  <Card key={job.id} className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>
                            Client: {job.client_email} | Budget: ${job.budget}
                          </CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'open'
                              ? 'bg-green-500/20 text-green-400'
                              : job.status === 'disputed'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : job.status === 'resolved'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">{job.description}</p>
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {job.skills_required.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Resolve Dispute Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Job: {selectedDispute?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResolveDispute} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Decision
              </label>
              <select
                value={resolution.decision}
                onChange={(e) => setResolution({ ...resolution, decision: e.target.value })}
                required
                className="w-full bg-slate-900 border-slate-700 text-white rounded-md p-2"
              >
                <option value="">Select decision...</option>
                <option value="favor_client">Favor Client (Refund)</option>
                <option value="favor_freelancer">Favor Freelancer (Release Payment)</option>
                <option value="split">Split Payment</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Resolution Notes
              </label>
              <Textarea
                value={resolution.notes}
                onChange={(e) => setResolution({ ...resolution, notes: e.target.value })}
                placeholder="Explain your decision..."
                required
                className="bg-slate-900 border-slate-700 text-white"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? 'Resolving...' : 'Resolve Dispute'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowResolveDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
