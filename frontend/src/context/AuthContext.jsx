import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from '../api/axios.js';

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



  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get('/auth/profile');
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/auth/register', { name, email, password });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await axios.put('/auth/profile', data);
    setUser(res.data);
    return res.data;
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await axios.post('/auth/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update local user state with new avatar
    setUser({ ...user, avatar: res.data.avatar });
    return res.data;
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
