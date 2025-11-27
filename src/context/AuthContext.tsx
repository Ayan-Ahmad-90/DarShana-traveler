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
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        const response = await authApi.getProfile();
        if (response.success && response.data) {
          setUser(response.data as User);
        }
      };
      fetchUser();
    }
  }, [token]);

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

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    const response = await authApi.register({
      name,
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
        token,
        login,
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
