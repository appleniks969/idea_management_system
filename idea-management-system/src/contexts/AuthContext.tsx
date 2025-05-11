import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Check if there's a saved user in localStorage
  const savedUser = localStorage.getItem('currentUser');
  const [currentUser, setCurrentUser] = useState<User | null>(
    savedUser ? JSON.parse(savedUser) : null
  );

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate
    // For our mock implementation, we'll check against our mock users
    const user = mockUsers.find(
      (u) => u.username === username && u.passwordHash === password
    );

    if (user) {
      const { passwordHash, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: currentUser !== null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a mock login with predefined user roles
export const mockLogin = async (role: UserRole): Promise<User> => {
  // Find a user with the requested role
  const mockUser = mockUsers.find(user => user.role === role);
  
  if (!mockUser) {
    throw new Error(`No mock user with role ${role} found`);
  }
  
  const { passwordHash, ...userWithoutPassword } = mockUser;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};