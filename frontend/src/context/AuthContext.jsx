import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shift_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth on app mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Failed to verify token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('shift_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('shift_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('shift_token');
    setToken(null);
    setUser(null);
  };

  const updateChecklist = async (key, checked) => {
    if (!user) return;
    try {
      // Optimistic update
      setUser((prev) => ({
        ...prev,
        chk: { ...(prev.chk || {}), [key]: checked },
      }));
      await authApi.updateChecklist(key, checked);
    } catch (err) {
      console.error('Failed to update checklist:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateChecklist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
