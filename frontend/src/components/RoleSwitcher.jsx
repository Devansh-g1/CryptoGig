import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSwitch = async () => {
    const newRole = currentRole === 'client' ? 'freelancer' : 'client';
    setLoading(true);

    try {
      const updatedUser = await switchRole(newRole);
      toast.success(`Switched to ${newRole} mode!`);
      
      // Navigate to new role dashboard without full page reload
      navigate(`/${newRole}`);
      
      // Call onRoleChange if provided
      if (onRoleChange) {
        onRoleChange(newRole);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || 'Failed to switch role');
      } else {
        toast.error('Failed to switch role');
      }
    } finally {
      setLoading(false);
    }
  };

  if (currentRole === 'arbitrator') {
    return null; // Arbitrators cannot switch
  }

  const otherRole = currentRole === 'client' ? 'Freelancer' : 'Client';

  return (
    <Button
      onClick={handleSwitch}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      Switch to {otherRole}
    </Button>
  );
}
