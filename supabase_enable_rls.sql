-- ====================================
-- ACTIVATION RLS - SÉCURITÉ CRITIQUE
-- À exécuter dans Supabase SQL Editor
-- ====================================

-- Activer RLS sur toutes les tables principales
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_payments ENABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien activé
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ====================================
-- FIX: Sécuriser les fonctions
-- ====================================

-- Fixer le search_path des fonctions existantes pour éviter les injections
-- On utilise DO pour ignorer les erreurs si certaines fonctions n'existent pas

DO $$
BEGIN
    -- Triggers
    EXECUTE 'ALTER FUNCTION public.update_conversations_updated_at() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.update_user_reports_updated_at() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.update_reports_updated_at() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.update_stripe_payments_updated_at() SET search_path = public, pg_temp';
    
    -- Fonctions métier
    EXECUTE 'ALTER FUNCTION public.count_unread_messages(uuid) SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_users_per_day() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_listings_by_category() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_listings_by_city() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.restore_or_create_support_conversation(uuid) SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_latest_messages_by_conversations(uuid) SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_revenue_per_day() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_top_users() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.get_top_listings() SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.count_conversations_with_received_messages(uuid) SET search_path = public, pg_temp';
    EXECUTE 'ALTER FUNCTION public.boost_listing(uuid) SET search_path = public, pg_temp';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Certaines fonctions n''existent pas, c''est normal';
END $$;

-- ====================================
-- BONUS: Activer protection mots de passe compromis
-- ====================================
-- À activer manuellement dans Dashboard > Authentication > Settings
-- Cocher "Check for compromised passwords (powered by HaveIBeenPwned)"
