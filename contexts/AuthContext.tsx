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
        // Vérifier si l'utilisateur est banni
        if (data.is_banned) {
          await supabase.auth.signOut();
          alert('Votre compte a été banni pour violation des conditions d\'utilisation.');
          setUser(null);
          return;
        }

        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatar_url || '',
          phone: data.phone || '',
          city: data.city || '',
          bio: data.bio || '',
          favorites: data.favorites?.map((f: any) => f.listing_id) || [],
          is_admin: data.is_admin || false,
          is_banned: data.is_banned || false
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
        options: {
          data: {
            name: userData.name,
            bio: userData.bio || '',
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      if (!authData.user) return false;

      // 2. Créer le profil utilisateur via fonction SECURITY DEFINER
      // Cette fonction bypass RLS car elle s'exécute avec les privilèges du propriétaire
      const { error: profileError } = await supabase.rpc('create_user_profile', {
        user_id: authData.user.id,
        user_email: userData.email,
        user_name: userData.name,
        user_bio: userData.bio || '',
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Ne pas charger le profil ici - l'utilisateur doit d'abord confirmer son email
      // Le profil sera chargé automatiquement après confirmation via onAuthStateChange
      return true;
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        details: error
      });
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
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center z-50">
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins relative overflow-hidden">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Appyna
            </span>
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          </h1>
          
          <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
              style={{
                animation: 'progress 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes progress {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 70%; margin-left: 15%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};