import { supabase } from './supabaseClient';

export interface Report {
  id: string;
  listing_id: string;
  reporter_id: string;
  reason: 'spam' | 'inappropriate' | 'scam' | 'duplicate' | 'other';
  description?: string;
  status: 'pending' | 'resolved' | 'rejected';
  created_at: string;
  updated_at: string;
  moderator_id?: string;
  moderator_note?: string;
  // Relations
  listing?: any;
  reporter?: any;
  moderator?: any;
}

export interface CreateReportInput {
  listing_id: string;
  reason: Report['reason'];
  description?: string;
}

export const reportsService = {
  /**
   * Créer un signalement
   */
  async createReport(reportData: CreateReportInput, userId: string): Promise<Report | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...reportData,
          reporter_id: userId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur création signalement:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur createReport:', error);
      return null;
    }
  },

  /**
   * Récupérer tous les signalements (admin uniquement)
   */
  async getAllReports(statusFilter?: Report['status']): Promise<Report[]> {
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          listing:listings(id, title, category, is_hidden),
          reporter:users!reports_reporter_id_fkey(id, name, email),
          moderator:users!reports_moderator_id_fkey(id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur récupération signalements:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur getAllReports:', error);
      return [];
    }
  },

  /**
   * Récupérer les signalements d'un utilisateur
   */
  async getUserReports(userId: string): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          listing:listings(id, title, category)
        `)
        .eq('reporter_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération signalements utilisateur:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur getUserReports:', error);
      return [];
    }
  },

  /**
   * Vérifier si un utilisateur a déjà signalé une annonce
   */
  async hasUserReportedListing(userId: string, listingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id')
        .eq('reporter_id', userId)
        .eq('listing_id', listingId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        console.error('Erreur vérification signalement:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Erreur hasUserReportedListing:', error);
      return false;
    }
  },

  /**
   * Approuver un signalement (masquer l'annonce)
   */
  async approveReport(reportId: string, moderatorId: string, moderatorNote?: string): Promise<boolean> {
    try {
      // 1. Récupérer l'annonce associée
      const { data: report } = await supabase
        .from('reports')
        .select('listing_id')
        .eq('id', reportId)
        .single();

      if (!report) return false;

      // 2. Masquer l'annonce
      const { error: listingError } = await supabase
        .from('listings')
        .update({ is_hidden: true })
        .eq('id', report.listing_id);

      if (listingError) {
        console.error('Erreur masquage annonce:', listingError);
        return false;
      }

      // 3. Mettre à jour le signalement
      const { error: reportError } = await supabase
        .from('reports')
        .update({
          status: 'resolved',
          moderator_id: moderatorId,
          moderator_note: moderatorNote
        })
        .eq('id', reportId);

      if (reportError) {
        console.error('Erreur mise à jour signalement:', reportError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur approveReport:', error);
      return false;
    }
  },

  /**
   * Rejeter un signalement
   */
  async rejectReport(reportId: string, moderatorId: string, moderatorNote?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: 'rejected',
          moderator_id: moderatorId,
          moderator_note: moderatorNote
        })
        .eq('id', reportId);

      if (error) {
        console.error('Erreur rejet signalement:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur rejectReport:', error);
      return false;
    }
  },

  /**
   * Bannir un utilisateur
   */
  async banUser(userId: string, moderatorNote?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_banned: true })
        .eq('id', userId);

      if (error) {
        console.error('Erreur bannissement utilisateur:', error);
        return false;
      }

      // Optionnel: masquer toutes les annonces de l'utilisateur
      await supabase
        .from('listings')
        .update({ is_hidden: true })
        .eq('user_id', userId);

      return true;
    } catch (error) {
      console.error('Erreur banUser:', error);
      return false;
    }
  },

  /**
   * Débannir un utilisateur
   */
  async unbanUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_banned: false })
        .eq('id', userId);

      if (error) {
        console.error('Erreur débannissement utilisateur:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur unbanUser:', error);
      return false;
    }
  },

  /**
   * Afficher une annonce masquée
   */
  async unhideListing(listingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_hidden: false })
        .eq('id', listingId);

      if (error) {
        console.error('Erreur affichage annonce:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur unhideListing:', error);
      return false;
    }
  }
};
