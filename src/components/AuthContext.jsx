import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, refreshCsrfToken } from '../data/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        await refreshCsrfToken();
        const data = await apiRequest('/api/auth/me');
        if (mounted) setUser(data.user);
      } catch (error) {
        if (mounted && !/sign in to continue/i.test(error.message)) console.error('Could not restore account session.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSession();
    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signUp: async (details) => {
      const data = await apiRequest('/api/auth/register', { method: 'POST', body: details });
      setUser(data.user);
      return data.user;
    },
    signIn: async (details) => {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: details });
      setUser(data.user);
      return data.user;
    },
    signOut: async () => {
      await apiRequest('/api/auth/logout', { method: 'POST', body: {} });
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
