import { supabase } from './supabaseClient';

export interface UserReport {
  id: string;
  reported_user_id: string;
  reporter_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'rejected';
  created_at: string;
  updated_at: string;
  moderator_id?: string;
  moderator_note?: string;
  // Relations
  reported_user?: any;
  reporter?: any;
  moderator?: any;
}

export interface CreateUserReportInput {
  reported_user_id: string;
  reason: string;
  description?: string;
}

export const userReportsService = {
  /**
   * Créer un signalement d'utilisateur
   */
  async createReport(reportData: CreateUserReportInput, reporterId: string): Promise<UserReport | null> {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .insert({
          ...reportData,
          reporter_id: reporterId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur création signalement utilisateur:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur createReport:', error);
      return null;
    }
  },

  /**
   * Récupérer tous les signalements d'utilisateurs (admin uniquement)
   */
  async getAllReports(statusFilter?: UserReport['status']): Promise<UserReport[]> {
    try {
      let query = supabase
        .from('user_reports')
        .select(`
          *,
          reported_user:users!user_reports_reported_user_id_fkey(id, name, email, avatar_url, is_banned),
          reporter:users!user_reports_reporter_id_fkey(id, name, email),
          moderator:users!user_reports_moderator_id_fkey(id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur récupération signalements utilisateurs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur getAllReports:', error);
      return [];
    }
  },

  /**
   * Récupérer les signalements faits par un utilisateur
   */
  async getUserReports(userId: string): Promise<UserReport[]> {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          *,
          reported_user:users!user_reports_reported_user_id_fkey(id, name, email)
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
   * Vérifier si un utilisateur a déjà signalé un autre utilisateur
   */
  async hasUserReportedUser(reporterId: string, reportedUserId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('id')
        .eq('reporter_id', reporterId)
        .eq('reported_user_id', reportedUserId)
        .single();

      return !!data && !error;
    } catch (error) {
      return false;
    }
  },

  /**
   * Approuver un signalement et bannir l'utilisateur
   */
  async approveReport(reportId: string, moderatorId: string, moderatorNote?: string): Promise<boolean> {
    try {
      // 1. Récupérer l'utilisateur signalé
      const { data: report } = await supabase
        .from('user_reports')
        .select('reported_user_id')
        .eq('id', reportId)
        .single();

      if (!report) return false;

      // 2. Bannir l'utilisateur
      const { error: userError } = await supabase
        .from('users')
        .update({ is_banned: true })
        .eq('id', report.reported_user_id);

      if (userError) {
        console.error('Erreur bannissement utilisateur:', userError);
        return false;
      }

      // 3. Masquer toutes les annonces de l'utilisateur
      await supabase
        .from('listings')
        .update({ is_hidden: true })
        .eq('user_id', report.reported_user_id);

      // 4. Mettre à jour le signalement
      const { error: reportError } = await supabase
        .from('user_reports')
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
        .from('user_reports')
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
  }
};
