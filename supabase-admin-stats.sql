-- Migration: Vues et fonctions pour les statistiques admin

-- 0. Supprimer la vue existante pour pouvoir changer le type de colonne
DROP VIEW IF EXISTS admin_global_stats;

-- 1. Vue pour les statistiques globales
CREATE OR REPLACE VIEW admin_global_stats AS
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '1 day') as users_today,
  (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days') as users_week,
  (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as users_month,
  (SELECT COUNT(*) FROM listings WHERE is_hidden = FALSE) as total_listings,
  (SELECT COUNT(*) FROM listings WHERE is_hidden = FALSE AND created_at >= NOW() - INTERVAL '1 day') as listings_today,
  (SELECT COUNT(*) FROM listings WHERE is_hidden = FALSE AND created_at >= NOW() - INTERVAL '7 days') as listings_week,
  (SELECT COUNT(*) FROM listings WHERE is_hidden = FALSE AND created_at >= NOW() - INTERVAL '30 days') as listings_month,
  (SELECT COUNT(*) FROM listings WHERE boosted_until IS NOT NULL AND boosted_until > NOW()) as active_boosts,
  (SELECT COUNT(*) FROM listings WHERE boosted_until IS NOT NULL) as total_boosts,
  (SELECT COALESCE(SUM(amount), 0) FROM stripe_payments WHERE status = 'succeeded') as total_revenue,
  (SELECT COUNT(DISTINCT conversation_id) FROM messages) as total_conversations,
  (SELECT COUNT(DISTINCT conversation_id) FROM messages WHERE created_at >= NOW() - INTERVAL '1 day') as conversations_today,
  (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports,
  (SELECT COUNT(*) FROM user_reports WHERE status = 'pending') as pending_user_reports,
  (SELECT COUNT(*) FROM users WHERE is_banned = TRUE) as banned_users,
  (SELECT COUNT(*) FROM listings WHERE is_hidden = TRUE) as hidden_listings;

-- 2. Fonction pour obtenir les inscriptions par jour sur les N derniers jours
CREATE OR REPLACE FUNCTION get_users_per_day(days_count INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
  FROM users
  WHERE created_at >= NOW() - (days_count || ' days')::INTERVAL
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql;

-- 3. Fonction pour obtenir les annonces par catégorie
CREATE OR REPLACE FUNCTION get_listings_by_category()
RETURNS TABLE (
  category TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.category,
    COUNT(*) as count
  FROM listings l
  WHERE l.is_hidden = FALSE
  GROUP BY l.category
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- 4. Fonction pour obtenir les annonces par ville
CREATE OR REPLACE FUNCTION get_listings_by_city()
RETURNS TABLE (
  city TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.city,
    COUNT(*) as count
  FROM listings l
  WHERE l.is_hidden = FALSE
  GROUP BY l.city
  ORDER BY count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 5. Fonction pour obtenir les revenus par jour (paiements Stripe)
CREATE OR REPLACE FUNCTION get_revenue_per_day(days_count INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COALESCE(SUM(amount), 0) as revenue
  FROM stripe_payments
  WHERE status = 'succeeded'
    AND created_at >= NOW() - (days_count || ' days')::INTERVAL
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql;

-- 6. Fonction pour obtenir le top utilisateurs (par nombre d'annonces)
CREATE OR REPLACE FUNCTION get_top_users(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  listings_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email as user_email,
    COUNT(l.id) as listings_count
  FROM users u
  LEFT JOIN listings l ON l.user_id = u.id AND l.is_hidden = FALSE
  GROUP BY u.id, u.name, u.email
  ORDER BY listings_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Fonction pour obtenir les top annonces (par nombre de favoris)
CREATE OR REPLACE FUNCTION get_top_listings(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  listing_id UUID,
  title TEXT,
  favorites_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id as listing_id,
    l.title,
    COUNT(f.id) as favorites_count
  FROM listings l
  LEFT JOIN favorites f ON f.listing_id = l.id
  WHERE l.is_hidden = FALSE
  GROUP BY l.id, l.title
  ORDER BY favorites_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 8. Policies RLS pour la vue admin_global_stats (admins uniquement)
-- Note: Les vues héritent des policies des tables sources, mais on peut ajouter une sécurité supplémentaire

-- Commentaires pour documentation
COMMENT ON VIEW admin_global_stats IS 'Vue regroupant toutes les statistiques globales pour le dashboard admin';
COMMENT ON FUNCTION get_users_per_day IS 'Retourne le nombre d''inscriptions par jour sur les N derniers jours';
COMMENT ON FUNCTION get_listings_by_category IS 'Retourne le nombre d''annonces par catégorie';
COMMENT ON FUNCTION get_listings_by_city IS 'Retourne le top 10 des villes par nombre d''annonces';
COMMENT ON FUNCTION get_revenue_per_day IS 'Retourne les revenus par jour sur les N derniers jours';
COMMENT ON FUNCTION get_top_users IS 'Retourne les utilisateurs avec le plus d''annonces';
COMMENT ON FUNCTION get_top_listings IS 'Retourne les annonces avec le plus de favoris';
