
'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../utils/axiosInstance';
import {jwtDecode} from "jwt-decode";
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
}
export interface User {
    id: string;
    email: string;
    role: string;
    // Add other user properties as needed
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
}


interface DecodedToken {
    id: string;
    email: string;
    exp: number;
    role: string;
  // Add other decoded properties if necessary
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Token decoding failed:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;

      // Store tokens 
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Decode token to get user info
      const decoded: DecodedToken = jwtDecode(accessToken);
      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      // Optionally auto-login after registration
      await login(userData.email, userData.password);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
