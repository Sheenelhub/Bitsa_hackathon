'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  studentId?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  studentId?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const response = await authAPI.getMe();
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data.data.user);
      if (response.data.data.token) {
        Cookies.set('token', response.data.data.token, { expires: 7 });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      const loginError: any = new Error(message);
      loginError.response = error?.response;
      throw loginError;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      setUser(response.data.data.user);
      if (response.data.data.token) {
        Cookies.set('token', response.data.data.token, { expires: 7 });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      const registerError: any = new Error(message);
      registerError.response = error?.response;
      throw registerError;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setUser(null);
      Cookies.remove('token');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

