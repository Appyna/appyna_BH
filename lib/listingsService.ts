import { supabase } from './supabaseClient';
import { Listing } from '../types';

export const listingsService = {
  // Récupérer toutes les annonces
  async getListings(filters?: {
    category?: string;
    city?: string;
    search?: string;
    boosted?: boolean;
  }): Promise<Listing[]> {
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
      .order('created_at', { ascending: false });

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

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return [];
    }

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
      user: listing.users ? {
        id: listing.users.id,
        name: listing.users.name,
        avatarUrl: listing.users.avatar_url || '',
        city: listing.users.city || '',
      } : undefined,
      boostedAt: listing.boosted_at,
      createdAt: listing.created_at,
    }));
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
      createdAt: data.created_at,
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
    console.log('Images reçues dans createListing:', listing.images);
    
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
      console.log('Images sauvegardées dans Supabase:', data.images);
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

  // Booster une annonce
  async boostListing(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('listings')
      .update({ boosted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error boosting listing:', error);
      return false;
    }

    return true;
  },

  // Récupérer les annonces d'un utilisateur
  async getUserListings(userId: string): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }

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
      createdAt: listing.created_at,
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
    };
  },

  // Vérifier si un nom d'utilisateur est disponible
  async checkUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    let query = supabase
      .from('users')
      .select('id')
      .eq('name', username);

    // Si on modifie un profil, exclure l'utilisateur actuel de la recherche
    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }

    // Si aucun résultat, le nom est disponible
    return data.length === 0;
  },
};
