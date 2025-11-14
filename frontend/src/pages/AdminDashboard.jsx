import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  LogOut,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [arbitrators, setArbitrators] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddArbitrator, setShowAddArbitrator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Check admin access
  useEffect(() => {
    const adminEmail = 'devanshgoyal1234@gmail.com';
    const adminWallet = '0x6a413e4c59cfb5d4544d5eca74dacf7848b3a483';
    
    if (user?.email !== adminEmail && user?.wallet_address?.toLowerCase() !== adminWallet.toLowerCase()) {
      toast.error('Access denied: Admin only');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchArbitrators();
    fetchAllUsers();
  }, []);

  const fetchArbitrators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/arbitrators`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArbitrators(response.data.arbitrators || []);
    } catch (error) {
      console.error('Failed to fetch arbitrators:', error);
      toast.error('Failed to load arbitrators');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAssignArbitrator = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/admin/arbitrators`, 
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('User assigned as arbitrator');
      setShowAddArbitrator(false);
      fetchArbitrators();
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to assign arbitrator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveArbitrator = async (userId) => {
    if (!confirm('Remove this user as arbitrator?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/arbitrators/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Arbitrator removed');
      fetchArbitrators();
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to remove arbitrator');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    !arbitrators.find(a => a.id === u.id) &&
    (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="glass-effect border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/10">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CryptoGig Admin</h1>
                <p className="text-sm text-slate-400">Arbitrator Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-300 hover:text-white"
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
          <Card className="glass-effect border-slate-700 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{allUsers.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Active Arbitrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{arbitrators.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono text-slate-300">
                {user?.email || 'Admin User'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Arbitrators Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Arbitrators</h2>
          <Button
            onClick={() => setShowAddArbitrator(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Arbitrator
          </Button>
        </div>

        {/* Arbitrators List */}
        <div className="space-y-4 mb-12">
          {arbitrators.length === 0 ? (
            <Card className="glass-effect border-slate-700 bg-slate-900/50">
              <CardContent className="py-12 text-center">
                <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No arbitrators assigned yet</p>
                <Button
                  onClick={() => setShowAddArbitrator(true)}
                  variant="outline"
                  className="border-green-500/50 text-green-300"
                >
                  Assign First Arbitrator
                </Button>
              </CardContent>
            </Card>
          ) : (
            arbitrators.map((arb) => (
              <Card key={arb.id} className="glass-effect border-slate-700 bg-slate-900/50 card-hover">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{arb.email}</div>
                        <div className="text-sm text-slate-400 font-mono">
                          {arb.wallet_address ? 
                            `${arb.wallet_address.slice(0, 10)}...${arb.wallet_address.slice(-8)}` : 
                            'No wallet connected'}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                      onClick={() => handleRemoveArbitrator(arb.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Arbitrator Dialog */}
      <Dialog open={showAddArbitrator} onOpenChange={setShowAddArbitrator}>
        <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Assign Arbitrator</DialogTitle>
            <DialogDescription className="text-slate-400">
              Select a user to assign as arbitrator
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by email or wallet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-700 pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Card 
                    key={user.id} 
                    className="glass-effect border-slate-700 bg-slate-800/50 cursor-pointer hover:border-green-500/50 transition-colors"
                    onClick={() => handleAssignArbitrator(user.id)}
                  >
                    <CardContent className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            {user.wallet_address ? 
                              `${user.wallet_address.slice(0, 10)}...${user.wallet_address.slice(-8)}` : 
                              'No wallet'}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Assign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
