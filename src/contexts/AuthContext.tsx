import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, avatar?: string, displayName?: string) => Promise<boolean>;
  logout: () => void;
  verifyCode: (code: string) => boolean;
  isCodeVerified: boolean;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  useEffect(() => {
    if (storage.isAuthenticated()) {
      const currentUser = storage.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    setIsCodeVerified(storage.isCodeVerified());
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = storage.getUsers();
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      // Update last active
      foundUser.lastActive = new Date().toISOString();
      foundUser.isOnline = true;
      
      const updatedUsers = users.map(u => u.id === foundUser.id ? foundUser : u);
      storage.setUsers(updatedUsers);
      
      setUser(foundUser);
      storage.setCurrentUser(foundUser);
      storage.setAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string, avatar?: string, displayName?: string): Promise<boolean> => {
    const users = storage.getUsers();
    
    if (users.find(u => u.email === email || u.username === username)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      rank: 'beklemede',
      avatar: avatar || '👤',
      displayName: displayName || username,
      isOnline: true,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      performance: 0,
      totalActions: 0,
      isAdmin: false,
      status: 'pending',
      isBanned: false
    };

    users.push(newUser);
    storage.setUsers(users);
    
    setUser(newUser);
    storage.setCurrentUser(newUser);
    storage.setAuthenticated(true);
    return true;
  };

  const logout = () => {
    if (user) {
      const users = storage.getUsers();
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, isOnline: false, lastActive: new Date().toISOString() } : u
      );
      storage.setUsers(updatedUsers);
    }
    
    setUser(null);
    setIsCodeVerified(false);
    storage.setAuthenticated(false);
    storage.setCodeVerified(false);
    localStorage.removeItem('minecraft_admin_current_user');
  };

  const verifyCode = (code: string): boolean => {
    // Ana kod
    if (code === 'mami!xiosxl@consolecraft') {
      setIsCodeVerified(true);
      storage.setCodeVerified(true);
      return true;
    }
    // Yedek kod
    if (code === 'code@consolecraft.com.12.12') {
      setIsCodeVerified(true);
      storage.setCodeVerified(true);
      return true;
    }
    return false;
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    storage.setCurrentUser(updatedUser);
    
    const users = storage.getUsers();
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    storage.setUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      verifyCode,
      isCodeVerified,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};