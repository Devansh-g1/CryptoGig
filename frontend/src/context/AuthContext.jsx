import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Only logout on 401 (unauthorized), not on network errors
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const response = await axios.get(`${API}/auth/me`);
        setUser(response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to refresh user:', error);
        // If token is invalid, logout
        if (error.response?.status === 401) {
          logout();
        }
        return null;
      }
    }
    return null;
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      // Handle both 'token' and 'access_token' for backward compatibility
      const newToken = response.data.access_token || response.data.token;
      const userData = response.data.user;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, name, role) => {
    const response = await axios.post(`${API}/auth/register`, { email, password, name, role });
    const { access_token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const linkWallet = async (walletAddress) => {
    try {
      await axios.post(`${API}/auth/link-wallet`, { wallet_address: walletAddress });
      setUser({ ...user, wallet_address: walletAddress });
      return true;
    } catch (error) {
      console.error('Failed to link wallet:', error);
      return false;
    }
  };

  const switchRole = async (newRole) => {
    try {
      const response = await axios.post(`${API}/auth/switch-role`, { new_role: newRole });
      const { access_token: newToken, user: updatedUser } = response.data;
      
      // Update token if provided
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }
      
      // Update user
      if (updatedUser) {
        setUser(updatedUser);
        return updatedUser;
      } else {
        // Refresh user data if not provided
        await refreshUser();
        return user;
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, linkWallet, refreshUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};