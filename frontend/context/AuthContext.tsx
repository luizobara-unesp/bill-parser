"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedEmail = localStorage.getItem('email');
      if (storedToken) {
        setToken(storedToken);
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error("Falha ao carregar o token do localStorage", error)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newEmail: string) => {
    setToken(newToken);
    setEmail(newEmail);
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', newEmail);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}