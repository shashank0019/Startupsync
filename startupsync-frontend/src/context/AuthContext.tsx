import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../api/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<string>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.login({ email, password });
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return email; // Return email for redirect to verification page
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setUser: handleSetUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
