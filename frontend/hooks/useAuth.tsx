'use client';

import { useState, useContext, useEffect, createContext, ReactNode } from 'react';
import { User } from '@/types';
import { authApi, apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role?: User['role']) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiClient.setToken(token);
        const response = await authApi.getCurrentUser();
        setUser(response.data.data);
      }
    } catch (error) {
      apiClient.clearToken();
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { user: userData, token } = response.data.data;
    
    localStorage.setItem('auth_token', token);
    apiClient.setToken(token);
    setUser(userData);
  };

  const register = async (username: string, email: string, password: string, role: User['role'] = 'viewer') => {
    const response = await authApi.register({
      username,
      email,
      password,
      role,
    });
    const { user: userData, token } = response.data.data;
    
    localStorage.setItem('auth_token', token);
    apiClient.setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
