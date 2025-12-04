import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  country?: string;
  preferredLanguage?: string;
  travelInterests?: string[];
  username?: string;
  usernameChangeCount?: number;
  role?: 'user' | 'admin';
  notificationPreferences?: {
    emailNotifications: boolean;
    festivalAlerts: boolean;
    smsNotifications: boolean;
    region?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  setAuth: (token: string, user: User) => void; // Direct auth setter
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check auth

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        setToken(storedToken);
        
        // Try to use stored user data first
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Failed to parse stored user');
          }
        }
        
        // Then try to fetch fresh data from API
        try {
          const response = await authApi.getProfile();
          if (response.success && response.data) {
            setUser(response.data as User);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await authApi.login(email, password);
    if (response.success && response.data) {
      const loginData = response.data as any;
      const { token: newToken, user: newUser } = loginData;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } else {
      throw new Error((response as any).error || 'Login failed');
    }
    setIsLoading(false);
  };

  // Direct auth setter for when Login component handles its own API call
  const setAuth = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    const response = await authApi.register({
      fullName: name,
      email,
      phone,
      password,
      confirmPassword: password,
    });
    if (response.success && response.data) {
      const loginData = response.data as any;
      const { token: newToken, user: newUser } = loginData;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } else {
      throw new Error((response as any).error || 'Registration failed');
    }
    setIsLoading(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const deleteAccount = async () => {
    const response = await authApi.deleteAccount();
    if (response.success) {
      logout();
    } else {
      throw new Error((response as any).error || 'Failed to delete account');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loading: isLoading,
        token,
        login,
        setAuth,
        register,
        logout,
        updateUser,
        deleteAccount,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
