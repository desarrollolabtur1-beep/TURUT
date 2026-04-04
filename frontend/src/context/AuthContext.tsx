import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api.service';

// Determine storage based on platform
let storage: {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
};

// For web, use localStorage
// For React Native, we'll need to use AsyncStorage (will be imported conditionally)
if (typeof window !== 'undefined') {
  // Web environment
  storage = {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  };
} else {
  // Placeholder for React Native - in a real app, you would import AsyncStorage
  // import { AsyncStorage } from 'react-native';
  // storage = AsyncStorage;
  storage = {
    getItem: async (key: string) => null, // Placeholder
    setItem: async (key: string, value: string) => {}, // Placeholder
    removeItem: async (key: string) => {}, // Placeholder
  };
}

interface AuthContextType {
  token: string | null;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token from storage on startup
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await storage.getItem('token');

        if (storedToken) {
          setToken(storedToken);
          // Fetch user profile
          try {
            const response = await authService.getProfile();
            setUser(response.data);
          } catch {
            setToken(null);
            await storage.removeItem('token');
          }
        }
      } catch {
        // Ignore error
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await authService.login({ email, password });
      const { token: newToken, ...userData } = response.data;
      setToken(newToken);
      setUser(userData);
      await storage.setItem('token', newToken);
    } catch {
      throw new Error('Login failed');
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });
      const { token: newToken, ...userData } = response.data;
      setToken(newToken);
      setUser(userData);
      await storage.setItem('token', newToken);
    } catch {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await storage.removeItem('token');
  };

  if (loading) {
    return null; // Or return a loading spinner
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
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
