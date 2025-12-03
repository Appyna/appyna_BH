import { supabase } from './supabaseClient';
import { Listing } from '../types';

export const listingsService = {
  // Récupérer toutes les annonces avec pagination
  async getListings(filters?: {
    category?: string;
    city?: string;
    search?: string;
    boosted?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Listing[]> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('listings')
      .select(`
        *,
        users (
          id,
          name,
          avatar_url,
          city
        )
      `)
      .eq('is_hidden', false); // Exclure les annonces masquées

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.boosted) {
      query = query.not('boosted_at', 'is', null).order('boosted_at', { ascending: false });
    }

    // Appliquer la pagination seulement si on a des filtres de pagination
    if (filters?.page !== undefined || filters?.limit !== undefined) {
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return [];
    }

    const listings = data.map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      city: listing.city,
      images: listing.images || [],
      type: listing.type,
      userId: listing.user_id,
      user: listing.users ? {
        id: listing.users.id,
        name: listing.users.name,
        avatarUrl: listing.users.avatar_url || '',
        city: listing.users.city || '',
      } : undefined,
      boostedAt: listing.boosted_at,
      boostedUntil: listing.boosted_until,
      createdAt: listing.created_at,
    }));

    // Tri manuel : annonces boostées actives en premier
    return listings.sort((a, b) => {
      const now = new Date();
      const aBoostActive = a.boostedUntil && new Date(a.boostedUntil) > now;
      const bBoostActive = b.boostedUntil && new Date(b.boostedUntil) > now;
      
      // 1. Les annonces boostées actives d'abord
      if (aBoostActive && !bBoostActive) return -1;
      if (!aBoostActive && bBoostActive) return 1;
      
      // 2. Si les deux sont boostées, tri par date de boost (plus récent d'abord)
      if (aBoostActive && bBoostActive) {
        const aBoostDate = a.boostedAt ? new Date(a.boostedAt).getTime() : new Date(a.createdAt).getTime();
        const bBoostDate = b.boostedAt ? new Date(b.boostedAt).getTime() : new Date(b.createdAt).getTime();
        return bBoostDate - aBoostDate;
      }
      
      // 3. Si aucune n'est boostée, tri par date de création
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  // Récupérer une annonce par ID
  async getListingById(id: string): Promise<Listing | null> {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        users (
          id,
          name,
          avatar_url,
          phone,
          city,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching listing:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      city: data.city,
      images: data.images || [],
      type: data.type,
      userId: data.user_id,
      user: data.users ? {
        id: data.users.id,
        name: data.users.name,
        email: data.users.email,
        avatarUrl: data.users.avatar_url || '',
        phone: data.users.phone || '',
        city: data.users.city || '',
      } : undefined,
      boostedAt: data.boosted_at,
      boostedUntil: data.boosted_until,
      createdAt: data.created_at,
      isHidden: data.is_hidden || false, // Ajouter pour vérifier si masquée
    };
  },

  // Créer une annonce
  async createListing(listing: {
    title: string;
    description: string;
    price: number;
    category: string;
    city: string;
    images: string[];
    type: string;
    userId: string;
  }): Promise<Listing | null> {

    
    const { data, error } = await supabase
      .from('listings')
      .insert([{
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        city: listing.city,
        images: listing.images,
        type: listing.type,
        user_id: listing.userId,
      }])
      .select()
      .single();
    
    if (data) {

    }

    if (error) {
      console.error('Error creating listing:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      city: data.city,
      images: data.images || [],
      type: data.type,
      userId: data.user_id,
      boostedAt: data.boosted_at,
      createdAt: data.created_at,
    };
  },

  // Mettre à jour une annonce
  async updateListing(id: string, updates: {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    city?: string;
    images?: string[];
  }): Promise<boolean> {
    const { error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating listing:', error);
      return false;
    }

    return true;
  },

  // Supprimer une annonce
  async deleteListing(id: string): Promise<boolean> {
    // Récupérer l'annonce pour obtenir les URLs des images
    const listing = await this.getListingById(id);
    
    if (listing && listing.images && listing.images.length > 0) {
      // Supprimer les images de Cloudinary
      const { uploadService } = await import('./uploadService');

      await uploadService.deleteMultipleImages(listing.images);
    }

    // Supprimer l'annonce de la base de données
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      return false;
    }

    return true;
  },

  // Booster une annonce pour X jours
  async boostListing(id: string, days: number): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('boost_listing', {
        p_listing_id: id,
        p_days: days
      });

    if (error) {
      console.error('Error boosting listing:', error);
      return false;
    }

    return true;
  },

  // Récupérer les annonces d'un utilisateur
  async getUserListings(userId: string, includeHidden: boolean = true): Promise<Listing[]> {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId);

    // Si on ne veut pas les annonces masquées (ex: vue publique du profil)
    if (!includeHidden) {
      query = query.eq('is_hidden', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }

    // La RLS policy s'occupe aussi du filtrage is_hidden pour la sécurité
    return data.map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      city: listing.city,
      images: listing.images || [],
      type: listing.type,
      userId: listing.user_id,
      boostedAt: listing.boosted_at,
      boostedUntil: listing.boosted_until,
      createdAt: listing.created_at,
      isHidden: listing.is_hidden, // Pour afficher un badge "Masquée" sur ses propres annonces
    }));
  },

  // Récupérer les infos d'un utilisateur
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      city: data.city,
      createdAt: data.created_at,
      is_banned: data.is_banned || false,
      is_admin: data.is_admin || false,
    };
  },

  // Vérifier si un nom d'utilisateur est disponible
  async checkUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    // Normaliser le nom : trim + réduire espaces multiples à un seul
    const normalizedUsername = username.trim().replace(/\s+/g, ' ');

    // Récupérer tous les utilisateurs
    let query = supabase
      .from('users')
      .select('id, name');

    // Si on modifie un profil, exclure l'utilisateur actuel de la recherche
    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }

    // Vérifier si un nom normalisé correspond
    const nameExists = data.some(user => {
      const existingNormalized = user.name.trim().replace(/\s+/g, ' ');
      return existingNormalized.toLowerCase() === normalizedUsername.toLowerCase();
    });

    // Si aucune correspondance, le nom est disponible
    return !nameExists;
  },
};
