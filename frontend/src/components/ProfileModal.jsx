import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { User, Github, Link as LinkIcon, Code, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function ProfileModal({ open, onClose, user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    portfolio_link: user?.portfolio_link || '',
    github_link: user?.github_link || '',
    skills: user?.skills?.join(', ') || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        portfolio_link: user.portfolio_link || '',
        github_link: user.github_link || '',
        skills: user.skills?.join(', ') || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };

      await axios.put(`${API}/profile`, updateData);
      toast.success('Profile updated successfully!');
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Edit Profile</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update your profile information and showcase your skills
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell clients about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div>
            <Label htmlFor="portfolio" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Portfolio Link
            </Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.portfolio_link}
              onChange={(e) => setFormData({ ...formData, portfolio_link: e.target.value })}
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div>
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub Profile
            </Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username"
              value={formData.github_link}
              onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div>
            <Label htmlFor="skills" className="flex items-center gap-2">
              <Code className="w-4 h-4" /> Skills (comma separated)
            </Label>
            <Input
              id="skills"
              placeholder="React, Node.js, Solidity, Web3"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="bg-slate-800 border-slate-700"
            />
            <p className="text-xs text-slate-500 mt-1">
              Separate skills with commas
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
