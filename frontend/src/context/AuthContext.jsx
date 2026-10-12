import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shift_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('shift_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth on app mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const storedToken = localStorage.getItem('shift_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (isMounted && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('shift_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Token verification check:', err.message);
          // ONLY log out if the backend returns explicit 401 Unauthorized
          // (i.e. token expired or invalid).
          // Do NOT log out on network blips, 500s, or when Render backend is waking up!
          if (err.status === 401) {
            logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('shift_token', res.token);
      localStorage.setItem('shift_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('shift_token', res.token);
      localStorage.setItem('shift_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('shift_token');
    localStorage.removeItem('shift_user');
    setToken(null);
    setUser(null);
  };

  const updateChecklist = async (key, checked) => {
    if (!user) return;
    try {
      const updatedUser = {
        ...user,
        chk: { ...(user.chk || {}), [key]: checked },
      };
      // Optimistic update
      setUser(updatedUser);
      localStorage.setItem('shift_user', JSON.stringify(updatedUser));
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
        isAuthenticated: !!user && !!token,
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
