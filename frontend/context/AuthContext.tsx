"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { jwtDecode } from "jwt-decode";

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

  const isTokenValid = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      return false
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');
        
        if (storedToken && storedEmail) {
          if (isTokenValid(storedToken)) {
            setToken(storedToken);
            setEmail(storedEmail);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            console.log("Token encontrado mas expirado. Limpando sessão.");
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error("Falha ao carregar o token", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newEmail: string) => {
    setToken(newToken);
    setEmail(newEmail);
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', newEmail);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    delete api.defaults.headers.common['Authorization'];
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