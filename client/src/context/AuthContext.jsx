import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(buildApiUrl('api/auth/me'));
          setUser(response.data);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt with:', { email, password });
      console.log('📡 Sending request to:', buildApiUrl('api/auth/login'));
      
      const response = await axios.post(buildApiUrl('api/auth/login'), { email, password });
      console.log('✅ Login successful:', response.data);
      
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('📊 Response data:', error.response?.data);
      console.error('📈 Response status:', error.response?.status);
      console.error('📋 Response headers:', error.response?.headers);
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const formData = new FormData();
      
      // Append regular fields
      Object.keys(userData).forEach(key => {
        if (key !== 'documents' && userData[key] !== undefined && userData[key] !== '') {
          formData.append(key, userData[key]);
        }
      });
      
      // Append documents
      if (userData.documents && userData.documents.length > 0) {
        userData.documents.forEach(file => {
          formData.append('documents', file);
        });
      }

      const response = await axios.post(buildApiUrl('api/auth/register'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, user, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};