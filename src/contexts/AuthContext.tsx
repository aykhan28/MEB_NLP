import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('nlp_meb_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      let mockUser: User;
      
      if (credentials.email.includes('ogrenci') || credentials.email.includes('student')) {
        mockUser = {
          id: '1',
          email: credentials.email,
          name: 'Ahmet Yılmaz',
          role: 'student',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          isActive: true,
        };
      } else if (credentials.email.includes('ogretmen') || credentials.email.includes('teacher')) {
        mockUser = {
          id: '2',
          email: credentials.email,
          name: 'Ayşe Öğretmen',
          role: 'teacher',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          isActive: true,
        };
      } else {
        mockUser = {
          id: '3',
          email: credentials.email,
          name: 'Mehmet Veli',
          role: 'parent',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          isActive: true,
        };
      }

      localStorage.setItem('nlp_meb_user', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=200`,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      localStorage.setItem('nlp_meb_user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('nlp_meb_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const updatedUser = { ...authState.user, ...data };
      localStorage.setItem('nlp_meb_user', JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};