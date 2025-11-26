// Service pour récupérer les statistiques admin
import { supabase } from './supabaseClient';

export interface GlobalStats {
  total_users: number;
  users_today: number;
  users_week: number;
  users_month: number;
  total_listings: number;
  listings_today: number;
  listings_week: number;
  listings_month: number;
  active_boosts: number;
  total_boosts: number;
  total_revenue: number;
  total_conversations: number;
  conversations_today: number;
  pending_reports: number;
  pending_user_reports: number;
  banned_users: number;
  hidden_listings: number;
}

export interface UsersPerDay {
  date: string;
  count: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface CityStat {
  city: string;
  count: number;
}

export interface RevenuePerDay {
  date: string;
  revenue: number;
}

export interface TopUser {
  user_id: string;
  user_name: string;
  user_email: string;
  listings_count: number;
}

export interface TopListing {
  listing_id: string;
  title: string;
  favorites_count: number;
}

/**
 * Récupère les statistiques globales
 */
export async function getGlobalStats(): Promise<GlobalStats | null> {
  try {
    const { data, error } = await supabase
      .from('admin_global_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des stats globales:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    return null;
  }
}

/**
 * Récupère les inscriptions par jour
 */
export async function getUsersPerDay(days: number = 30): Promise<UsersPerDay[]> {
  try {
    const { data, error } = await supabase.rpc('get_users_per_day', {
      days_count: days,
    });

    if (error) {
      console.error('Erreur getUsersPerDay:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getUsersPerDay:', error);
    return [];
  }
}

/**
 * Récupère les annonces par catégorie
 */
export async function getListingsByCategory(): Promise<CategoryStat[]> {
  try {
    const { data, error } = await supabase.rpc('get_listings_by_category');

    if (error) {
      console.error('Erreur getListingsByCategory:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getListingsByCategory:', error);
    return [];
  }
}

/**
 * Récupère les annonces par ville (top 10)
 */
export async function getListingsByCity(): Promise<CityStat[]> {
  try {
    const { data, error } = await supabase.rpc('get_listings_by_city');

    if (error) {
      console.error('Erreur getListingsByCity:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getListingsByCity:', error);
    return [];
  }
}

/**
 * Récupère les revenus par jour
 */
export async function getRevenuePerDay(days: number = 30): Promise<RevenuePerDay[]> {
  try {
    const { data, error } = await supabase.rpc('get_revenue_per_day', {
      days_count: days,
    });

    if (error) {
      console.error('Erreur getRevenuePerDay:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getRevenuePerDay:', error);
    return [];
  }
}

/**
 * Récupère le top utilisateurs (par nombre d'annonces)
 */
export async function getTopUsers(limit: number = 5): Promise<TopUser[]> {
  try {
    const { data, error } = await supabase.rpc('get_top_users', {
      limit_count: limit,
    });

    if (error) {
      console.error('Erreur getTopUsers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getTopUsers:', error);
    return [];
  }
}

/**
 * Récupère les top annonces (par nombre de favoris)
 */
export async function getTopListings(limit: number = 5): Promise<TopListing[]> {
  try {
    const { data, error } = await supabase.rpc('get_top_listings', {
      limit_count: limit,
    });

    if (error) {
      console.error('Erreur getTopListings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getTopListings:', error);
    return [];
  }
}

export const adminService = {
  getGlobalStats,
  getUsersPerDay,
  getListingsByCategory,
  getListingsByCity,
  getRevenuePerDay,
  getTopUsers,
  getTopListings,
};
