import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '../data/mock';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (userData: { name: string; email: string; password: string; bio?: string }) => boolean;
  logout: () => void;
  updateProfile: (updates: { name?: string; bio?: string; avatarUrl?: string }) => void;
  toggleFavorite: (listingId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // TEMPORAIRE : Simuler un utilisateur connecté pour la démo
  const [user, setUser] = useState<User | null>(mockUsers[0]);

  const login = (email: string, password: string): boolean => {
    // Simulation de connexion - en réalité, on ferait un appel API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (userData: { name: string; email: string; password: string; bio?: string }): boolean => {
    // Simulation d'inscription - en réalité, on ferait un appel API
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      bio: '', // Bio vide par défaut
      avatarUrl: '', // Pas de photo par défaut
      favorites: []
    };
    setUser(newUser);
    return true;
  };

  const logout = (): void => {
    setUser(null);
  };

  const updateProfile = (updates: { name?: string; bio?: string; avatarUrl?: string }): void => {
    if (!user) return;
    
    // Mise à jour de l'utilisateur avec les nouvelles données
    const updatedUser: User = {
      ...user,
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.bio !== undefined && { bio: updates.bio }),
      ...(updates.avatarUrl !== undefined && { avatarUrl: updates.avatarUrl }),
    };
    
    setUser(updatedUser);
    
    // En production, on ferait un appel API ici :
    // await fetch(`/api/users/${user.id}`, { method: 'PATCH', body: JSON.stringify(updates) })
  };

  const toggleFavorite = (listingId: string): void => {
    if (!user) return;

    const isFavorite = user.favorites.includes(listingId);
    const updatedFavorites = isFavorite
      ? user.favorites.filter(id => id !== listingId)
      : [...user.favorites, listingId];

    setUser({
      ...user,
      favorites: updatedFavorites
    });

    // En production, on ferait un appel API ici
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    toggleFavorite,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};