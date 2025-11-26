-- ====================================
-- SÉCURISER admin_global_stats
-- À exécuter dans Supabase SQL Editor
-- ====================================

-- 1. Supprimer l'ancienne view non sécurisée
DROP VIEW IF EXISTS public.admin_global_stats CASCADE;

-- 2. Créer une fonction sécurisée accessible uniquement aux admins
CREATE OR REPLACE FUNCTION public.get_admin_global_stats()
RETURNS TABLE (
  total_users bigint,
  total_listings bigint,
  active_listings bigint,
  total_messages bigint,
  total_conversations bigint,
  total_reports bigint,
  pending_reports bigint,
  total_revenue numeric,
  total_favorites bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  -- Retourner les statistiques
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.users)::bigint as total_users,
    (SELECT COUNT(*) FROM public.listings)::bigint as total_listings,
    (SELECT COUNT(*) FROM public.listings WHERE status = 'active')::bigint as active_listings,
    (SELECT COUNT(*) FROM public.messages)::bigint as total_messages,
    (SELECT COUNT(*) FROM public.conversations)::bigint as total_conversations,
    (SELECT COUNT(*) FROM public.reports)::bigint as total_reports,
    (SELECT COUNT(*) FROM public.reports WHERE status = 'pending')::bigint as pending_reports,
    (SELECT COALESCE(SUM(amount), 0) FROM public.stripe_payments WHERE status = 'succeeded')::numeric as total_revenue,
    (SELECT COUNT(*) FROM public.favorites)::bigint as total_favorites;
END;
$$;

-- 3. Donner les permissions
GRANT EXECUTE ON FUNCTION public.get_admin_global_stats() TO authenticated;

-- 4. Vérifier que ça fonctionne (doit échouer si tu n'es pas admin)
SELECT * FROM public.get_admin_global_stats();
