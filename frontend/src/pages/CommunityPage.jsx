import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function CommunityPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newChannelData, setNewChannelData] = useState({ name: '', skill: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [voteTarget, setVoteTarget] = useState({ userId: '', reason: '' });
  const [channelMembers, setChannelMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberProfileOpen, setMemberProfileOpen] = useState(false);

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      console.log('Selected channel:', selectedChannel);
      loadMessages();
      loadChannelMembers();
      const interval = setInterval(loadMessages, 3000); // Refresh messages every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedChannel]);

  const loadChannels = async () => {
    try {
      const res = await axios.get(`${API}/channels`);
      setChannels(res.data);
    } catch (error) {
      toast.error('Failed to load channels');
    }
  };

  const loadChannelMembers = async () => {
    if (!selectedChannel) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/channels/${selectedChannel.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Channel members loaded:', res.data);
      setChannelMembers(res.data);
    } catch (error) {
      console.error('Failed to load members:', error.response?.data || error.message);
      toast.error('Failed to load channel members');
    }
  };

  const createChannel = async () => {
    if (!newChannelData.name || !newChannelData.skill) {
      return toast.error('Name and skill are required');
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/channels`, newChannelData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Channel created!');
      setCreateDialogOpen(false);
      setNewChannelData({ name: '', skill: '', description: '' });
      loadChannels();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  const joinChannel = async (channelId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/channels/${channelId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Joined channel!');
      loadChannels();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to join');
    }
  };

  const leaveChannel = async (channelId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/channels/${channelId}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Left channel');
      if (selectedChannel?.id === channelId) {
        setSelectedChannel(null);
      }
      loadChannels();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to leave');
    }
  };

  const loadMessages = async () => {
    if (!selectedChannel) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/channels/${selectedChannel.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (error) {
      // Silent fail for message loading
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/channels/${selectedChannel.id}/messages`, 
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      loadMessages();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const voteToKick = async () => {
    if (!voteTarget.userId || !voteTarget.reason) {
      return toast.error('Select a user and provide a reason');
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/channels/${selectedChannel.id}/vote-kick`, 
        { target_user_id: voteTarget.userId, reason: voteTarget.reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Vote recorded!');
      setVoteDialogOpen(false);
      setVoteTarget({ userId: '', reason: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to vote');
    }
  };

  const isMember = (channel) => {
    return user && channel.members && channel.members.includes(user.id);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
              💬 Community Channels
            </h1>
            <p style={{ color: '#94a3b8' }}>Connect with others in skill-based communities</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}>
                ➕ Create Channel
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle style={{ color: 'white' }}>Create New Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Channel Name</Label>
                  <Input 
                    value={newChannelData.name}
                    onChange={e => setNewChannelData({...newChannelData, name: e.target.value})}
                    placeholder="React Developers"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label>Skill</Label>
                  <Input 
                    value={newChannelData.skill}
                    onChange={e => setNewChannelData({...newChannelData, skill: e.target.value})}
                    placeholder="React"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Input 
                    value={newChannelData.description}
                    onChange={e => setNewChannelData({...newChannelData, description: e.target.value})}
                    placeholder="A place for React developers to connect"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <Button onClick={createChannel} disabled={loading} className="w-full" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}>
                  {loading ? 'Creating...' : 'Create Channel'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: selectedChannel ? '300px 1fr 280px' : '1fr', 
          gap: '1.5rem',
          width: '100%',
          maxWidth: '100%',
          overflow: 'visible'
        }}>
          {/* Channels List */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
              Available Channels
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {channels.map(channel => (
                <Card 
                  key={channel.id} 
                  className="bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-700 transition"
                  onClick={() => isMember(channel) && setSelectedChannel(channel)}
                  style={{ opacity: isMember(channel) ? 1 : 0.7 }}
                >
                  <CardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <CardTitle style={{ color: 'white', fontSize: '1.25rem' }}>
                          {channel.name}
                        </CardTitle>
                        <CardDescription style={{ marginTop: '0.5rem' }}>
                          <Badge style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                            {channel.skill}
                          </Badge>
                        </CardDescription>
                      </div>
                      {isMember(channel) ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); leaveChannel(channel.id); }}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); joinChannel(channel.id); }}
                          style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {channel.description || 'No description'}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      👥 {channel.member_count} member{channel.member_count !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {channels.length === 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8' }}>No channels yet. Create the first one!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedChannel && (
            <Card className="bg-slate-800 border-slate-700" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <CardTitle style={{ color: 'white' }}>#{selectedChannel.name}</CardTitle>
                    <CardDescription>
                      <Badge style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', marginTop: '0.5rem' }}>
                        {selectedChannel.skill}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">⚖️ Vote to Kick</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle style={{ color: 'white' }}>Vote to Remove Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Select Member</Label>
                          <select 
                            value={voteTarget.userId}
                            onChange={e => setVoteTarget({...voteTarget, userId: e.target.value})}
                            className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2"
                          >
                            <option value="">Choose a member...</option>
                            {channelMembers
                              .filter(m => m.id !== user?.id && !m.is_creator)
                              .map(member => (
                                <option key={member.id} value={member.id}>
                                  {member.name} ({member.email})
                                </option>
                              ))}
                          </select>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                            {channelMembers.length} members • Cannot kick yourself or channel creator
                          </p>
                        </div>
                        <div>
                          <Label>Reason</Label>
                          <Input 
                            value={voteTarget.reason}
                            onChange={e => setVoteTarget({...voteTarget, reason: e.target.value})}
                            placeholder="Reason for removal"
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>
                        <Button onClick={voteToKick} className="w-full" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}>
                          Submit Vote
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <ScrollArea style={{ flex: 1, padding: '1rem' }}>
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      background: 'rgba(15, 23, 42, 0.5)', 
                      borderRadius: '0.5rem',
                      border: msg.user_id === user?.id ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(148, 163, 184, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        {msg.user_name} {msg.user_id === user?.id && '(You)'}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{msg.content}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No messages yet. Start the conversation!
                  </div>
                )}
              </ScrollArea>

              <CardContent style={{ padding: '1rem', borderTop: '1px solid #334155' }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-slate-700 border-slate-600 flex-1"
                  />
                  <Button type="submit" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}>
                    Send
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Members Sidebar - ALWAYS SHOW WHEN CHANNEL SELECTED */}
          {selectedChannel && (
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '0.5rem', border: '2px solid #3b82f6' }}>
              <Card className="bg-slate-800 border-slate-700" style={{ height: '600px', display: 'flex', flexDirection: 'column', minWidth: '250px' }}>
                <CardHeader style={{ background: 'rgba(59, 130, 246, 0.1)', borderBottom: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <CardTitle style={{ color: '#60a5fa', fontSize: '1.125rem' }}>
                    👥 Members ({channelMembers.length})
                  </CardTitle>
                </CardHeader>
                <ScrollArea style={{ flex: 1, padding: '0 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {channelMembers.map(member => (
                    <div
                      key={member.id}
                      onClick={() => {
                        setSelectedMember(member);
                        setMemberProfileOpen(true);
                      }}
                      style={{
                        padding: '0.75rem',
                        background: 'rgba(15, 23, 42, 0.5)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                          {member.name}
                        </span>
                        {member.is_builder && (
                          <Badge style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fbbf24', fontSize: '0.625rem', padding: '0.125rem 0.375rem' }}>
                            ⚡ Builder
                          </Badge>
                        )}
                      </div>
                      {member.skills && member.skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {member.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontSize: '0.625rem', padding: '0.125rem 0.25rem' }}>
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 2 && (
                            <span style={{ color: '#64748b', fontSize: '0.625rem' }}>+{member.skills.length - 2}</span>
                          )}
                        </div>
                      )}
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        ⭐ {member.rating.toFixed(1)} • {member.completed_jobs_count} jobs
                      </div>
                    </div>
                  ))}
                  {channelMembers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      <p>Loading members...</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
            </div>
          )}
        </div>

        {/* Member Profile Dialog */}
        <Dialog open={memberProfileOpen} onOpenChange={setMemberProfileOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{ color: 'white', fontSize: '1.5rem' }}>
                {selectedMember?.name}
                {selectedMember?.is_builder && (
                  <Badge style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fbbf24', marginLeft: '0.5rem' }}>
                    ⚡ Builder
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    {selectedMember.email}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                      ⭐ {selectedMember.rating.toFixed(1)} rating
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                      ✅ {selectedMember.completed_jobs_count} jobs completed
                    </span>
                  </div>
                </div>

                {selectedMember.bio && (
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Bio</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{selectedMember.bio}</p>
                  </div>
                )}

                {selectedMember.skills && selectedMember.skills.length > 0 && (
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedMember.skills.map((skill, idx) => (
                        <Badge key={idx} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {selectedMember.portfolio_link && (
                    <a
                      href={selectedMember.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#60a5fa',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      🔗 Portfolio
                    </a>
                  )}
                  {selectedMember.github_link && (
                    <a
                      href={selectedMember.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#60a5fa',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      💻 GitHub
                    </a>
                  )}
                </div>

                {selectedMember.joined_at && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                    <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Joined {new Date(selectedMember.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
