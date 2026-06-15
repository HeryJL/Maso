import React, { createContext, useState, useContext, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return { success: true };
    } else {
      setError('Email ou mot de passe incorrect');
      setIsLoading(false);
      return { success: false };
    }
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setError('Un compte existe déjà avec cet email');
      setIsLoading(false);
      return { success: false };
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      email, name, phone, avatar: null,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_USERS.push({ ...newUser, password });
    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};