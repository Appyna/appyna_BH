import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; password: string; bio?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: { name?: string; bio?: string; avatarUrl?: string }) => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, favorites(listing_id)')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatar_url || '',
          phone: data.phone || '',
          city: data.city || '',
          bio: data.bio || '',
          favorites: data.favorites?.map((f: any) => f.listing_id) || []
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Vérifier si c'est un problème de confirmation d'email
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'email_not_confirmed' };
        }
        // Autres erreurs (mauvais identifiants, etc.)
        return { success: false, error: 'invalid_credentials' };
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return { success: true };
      }
      return { success: false, error: 'unknown' };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Vérifier le type d'erreur spécifique
      if (error.message?.includes('Email not confirmed')) {
        return { success: false, error: 'email_not_confirmed' };
      }
      return { success: false, error: 'invalid_credentials' };
    }
  };

  const register = async (userData: { name: string; email: string; password: string; bio?: string }): Promise<boolean> => {
    try {
      // 1. Créer le compte auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;
      if (!authData.user) return false;

      // 2. Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          bio: userData.bio || '',
        }]);

      if (profileError) throw profileError;

      // Ne pas charger le profil ici - l'utilisateur doit d'abord confirmer son email
      // Le profil sera chargé automatiquement après confirmation via onAuthStateChange
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const updateProfile = async (updates: { name?: string; bio?: string; avatarUrl?: string }): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.bio !== undefined && { bio: updates.bio }),
          ...(updates.avatarUrl !== undefined && { avatar_url: updates.avatarUrl }),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setUser({
        ...user,
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.bio !== undefined && { bio: updates.bio }),
        ...(updates.avatarUrl !== undefined && { avatarUrl: updates.avatarUrl }),
      });
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const toggleFavorite = async (listingId: string): Promise<void> => {
    if (!user) return;

    const isFavorite = user.favorites.includes(listingId);

    try {
      if (isFavorite) {
        // Retirer des favoris
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (error) throw error;

        setUser({
          ...user,
          favorites: user.favorites.filter(id => id !== listingId)
        });
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, listing_id: listingId }]);

        if (error) throw error;

        setUser({
          ...user,
          favorites: [...user.favorites, listingId]
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    toggleFavorite,
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};