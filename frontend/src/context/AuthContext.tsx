import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService } from '../services/api.service';
import { setUnauthorizedCallback } from '../services/api.service';

// ─── Storage adapter (web / React Native) ────────────────────────────────────
// Web usa localStorage. RN usaría AsyncStorage (importar condicionalmente).
let storage: {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
};

if (typeof window !== 'undefined') {
  // Web environment
  storage = {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  };
} else {
  // React Native placeholder — reemplazar con AsyncStorage cuando se migre a nativo
  storage = {
    getItem: async (_key: string) => null,
    setItem: async (_key: string, _value: string) => {},
    removeItem: async (_key: string) => {},
  };
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Destino visitado (populated) */
export interface VisitedDestination {
  destination: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    category: string;
  } | string; // may be unpopulated ObjectId
  visitedAt: string;
}

/** Perfil de usuario devuelto por el backend */
export interface UserPreferences {
  experienceTypes?: string[];
  travelCompany?: string;
  availableTime?: string;
  coffeeExperience?: string;
  coffeeInterests?: string[];
  naturePreferences?: string[];
  lodgingStyle?: string;
  connectivityPreference?: string;
  escapeTime?: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive?: boolean;
  profileImage?: string;
  bio?: string;
  visitedDestinations?: VisitedDestination[];
  // Datos demográficos
  city?: string;
  phone?: string;
  birthDate?: string | null;
  gender?: string;
  // Preferencias de exploración
  preferences?: UserPreferences;
  // Necesidades especiales
  specialNeeds?: string[];
  // Canal de adquisición
  acquisitionSource?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch profile from backend (use after profile edits) */
  refreshUser: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Logout (forward declaration para usarlo en el callback 401) ──────────
  const logout = async () => {
    setToken(null);
    setUser(null);
    await storage.removeItem('token');
  };

  // ── Refresh user profile from backend ────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const response = await userService.getProfile();
      setUser(response.data.data);
    } catch {
      // Silently fail — user will see stale data
    }
  }, []);

  // ── Registrar callback de sesión expirada en el interceptor 401 ──────────
  useEffect(() => {
    setUnauthorizedCallback(logout);
    return () => {
      // Limpiar callback al desmontar
      setUnauthorizedCallback(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cargar token persistido al iniciar la app ────────────────────────────
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await storage.getItem('token');

        if (storedToken) {
          setToken(storedToken);
          // Verificar que el token sigue siendo válido obteniendo el perfil
          try {
            const response = await authService.getProfile();
            // Backend responde: { success: true, data: { _id, email, ... } }
            setUser(response.data.data);
          } catch {
            // Token inválido o expirado → limpiar
            setToken(null);
            await storage.removeItem('token');
          }
        }
      } catch {
        // Ignorar errores de lectura del storage
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  /**
   * Autentica al usuario con email y contraseña.
   * Backend responde: { success: true, data: { _id, email, ... }, token: "..." }
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ email, password });
      // El token viene en la raíz de response.data, el usuario en response.data.data
      const { token: newToken, data: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      await storage.setItem('token', newToken);
    } catch (error: any) {
      // Re-lanzar con mensaje legible para el UI
      const message =
        error?.response?.data?.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  // ── Register ─────────────────────────────────────────────────────────────
  /**
   * Crea una cuenta nueva y autentica al usuario.
   * Backend responde: { success: true, data: { _id, email, ... }, token: "..." }
   */
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    try {
      const response = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });
      // Igual que login: token en raíz, user en data.data
      const { token: newToken, data: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      await storage.setItem('token', newToken);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Error al crear la cuenta';
      throw new Error(message);
    }
  };

  // ── Mientras carga el token inicial no renderizar nada ───────────────────
  // Evita el flash de la pantalla de login si ya hay sesión guardada.
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
