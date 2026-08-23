import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  api,
  UserProfile,
  clearStoredTokens,
  getStoredToken,
  refreshAccessToken,
} from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    company_name?: string;
    country?: string;
  }) => Promise<void>;
  logout: (redirectTo?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // F5: access is memory-only; recover session via httpOnly refresh cookie.
        let token = getStoredToken();
        if (!token) {
          token = await refreshAccessToken(false);
        }
        if (token) {
          const profile = await api.getMe();
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        clearStoredTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    company_name?: string;
    country?: string;
  }) => {
    const res = await api.register(payload);
    setUser(res.user);
  };

  const logout = (redirectTo?: string) => {
    void (async () => {
      try {
        await api.logout();
      } catch {
        clearStoredTokens();
      }
      setUser(null);
      if (redirectTo && typeof window !== 'undefined') {
        window.location.assign(redirectTo);
      }
    })();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
