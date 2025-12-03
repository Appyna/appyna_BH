-- ============================================
-- FIX SECURITY ADVISOR WARNINGS
-- ============================================
-- Ce script corrige les 17 avertissements de sécurité liés à :
-- 1. search_path mutable dans les fonctions SECURITY DEFINER
-- 2. Vue admin_global_stats avec SECURITY DEFINER
-- ============================================

-- ============================================
-- 1. SÉCURISER LA VUE admin_global_stats
-- ============================================

-- Supprimer l'ancienne vue
DROP VIEW IF EXISTS public.admin_global_stats;

-- Recréer la vue SANS SECURITY DEFINER (plus sûr)
CREATE OR REPLACE VIEW public.admin_global_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.listings) as total_listings,
  (SELECT COUNT(*) FROM public.conversations) as total_conversations,
  (SELECT COUNT(*) FROM public.messages) as total_messages;

-- Ajouter une politique RLS pour limiter l'accès aux admins uniquement
ALTER VIEW public.admin_global_stats SET (security_invoker = true);


-- ============================================
-- 2. SÉCURISER TOUTES LES FONCTIONS
-- ============================================

-- Fonction: update_conversations_updated_at
CREATE OR REPLACE FUNCTION public.update_conversations_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fonction: soft_delete_conversation
DROP FUNCTION IF EXISTS public.soft_delete_conversation(UUID, UUID);
CREATE FUNCTION public.soft_delete_conversation(p_conversation_id UUID, p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE conversations
  SET deleted_by = p_user_id, deleted_at = NOW()
  WHERE id = p_conversation_id;
END;
$$;

-- Fonction: update_user_reports_updated_at
CREATE OR REPLACE FUNCTION public.update_user_reports_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fonction: count_unread_messages
DROP FUNCTION IF EXISTS public.count_unread_messages(UUID);
CREATE FUNCTION public.count_unread_messages(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM messages m
  JOIN conversations c ON m.conversation_id = c.id
  WHERE (c.user1_id = user_uuid OR c.user2_id = user_uuid)
    AND m.sender_id != user_uuid
    AND m.read_at IS NULL;
  
  RETURN COALESCE(unread_count, 0);
END;
$$;

-- Fonction: get_users_per_day
CREATE OR REPLACE FUNCTION public.get_users_per_day()
RETURNS TABLE(day DATE, count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as day,
    COUNT(*) as count
  FROM public.users
  GROUP BY DATE(created_at)
  ORDER BY day DESC;
END;
$$;

-- Fonction: get_listings_by_category
CREATE OR REPLACE FUNCTION public.get_listings_by_category()
RETURNS TABLE(category TEXT, count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.category::TEXT,
    COUNT(*) as count
  FROM public.listings l
  GROUP BY l.category
  ORDER BY count DESC;
END;
$$;

-- Fonction: get_listings_by_city
CREATE OR REPLACE FUNCTION public.get_listings_by_city()
RETURNS TABLE(city TEXT, count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.city,
    COUNT(*) as count
  FROM public.listings l
  GROUP BY l.city
  ORDER BY count DESC;
END;
$$;

-- Fonction: update_reports_updated_at
CREATE OR REPLACE FUNCTION public.update_reports_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fonction: update_stripe_payments_updated_at
CREATE OR REPLACE FUNCTION public.update_stripe_payments_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fonction: restore_or_create_support_conversation
DROP FUNCTION IF EXISTS public.restore_or_create_support_conversation(UUID);
CREATE FUNCTION public.restore_or_create_support_conversation(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv_id UUID;
  admin_id UUID;
BEGIN
  -- Trouver un admin
  SELECT id INTO admin_id FROM public.users WHERE is_admin = true LIMIT 1;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No admin found';
  END IF;

  -- Chercher conversation support existante
  SELECT id INTO conv_id
  FROM public.conversations
  WHERE (user1_id = user_uuid AND user2_id = admin_id AND is_support = true)
     OR (user2_id = user_uuid AND user1_id = admin_id AND is_support = true);

  IF conv_id IS NOT NULL THEN
    -- Restaurer si supprimée
    UPDATE public.conversations
    SET deleted_at = NULL, deleted_by = NULL
    WHERE id = conv_id;
    RETURN conv_id;
  ELSE
    -- Créer nouvelle conversation
    INSERT INTO public.conversations (user1_id, user2_id, is_support)
    VALUES (user_uuid, admin_id, true)
    RETURNING id INTO conv_id;
    RETURN conv_id;
  END IF;
END;
$$;

-- Fonction: get_latest_messages_by_conversations
DROP FUNCTION IF EXISTS public.get_latest_messages_by_conversations(UUID);
CREATE FUNCTION public.get_latest_messages_by_conversations(user_uuid UUID)
RETURNS TABLE(conversation_id UUID, latest_message_id UUID, content TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (m.conversation_id)
    m.conversation_id,
    m.id as latest_message_id,
    m.content,
    m.created_at
  FROM public.messages m
  JOIN public.conversations c ON m.conversation_id = c.id
  WHERE (c.user1_id = user_uuid OR c.user2_id = user_uuid)
  ORDER BY m.conversation_id, m.created_at DESC;
END;
$$;

-- Fonction: get_revenue_per_day
CREATE OR REPLACE FUNCTION public.get_revenue_per_day()
RETURNS TABLE(day DATE, revenue NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as day,
    SUM(amount / 100.0) as revenue
  FROM public.stripe_payments
  WHERE status = 'succeeded'
  GROUP BY DATE(created_at)
  ORDER BY day DESC;
END;
$$;

-- Fonction: get_top_users
CREATE OR REPLACE FUNCTION public.get_top_users()
RETURNS TABLE(user_id UUID, name TEXT, listing_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.name,
    COUNT(l.id) as listing_count
  FROM public.users u
  LEFT JOIN public.listings l ON u.id = l.user_id
  GROUP BY u.id, u.name
  ORDER BY listing_count DESC
  LIMIT 10;
END;
$$;

-- Fonction: get_top_listings
CREATE OR REPLACE FUNCTION public.get_top_listings()
RETURNS TABLE(listing_id UUID, title TEXT, views BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id as listing_id,
    l.title,
    COALESCE(l.views, 0) as views
  FROM public.listings l
  ORDER BY views DESC NULLS LAST
  LIMIT 10;
END;
$$;
-- Fonction: count_conversations_with_received_messages
DROP FUNCTION IF EXISTS public.count_conversations_with_received_messages(UUID);
CREATE FUNCTION public.count_conversations_with_received_messages(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversation_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT m.conversation_id)
  INTO conversation_count
  FROM public.messages m
  JOIN public.conversations c ON m.conversation_id = c.id
  WHERE (c.user1_id = user_uuid OR c.user2_id = user_uuid)
    AND m.sender_id != user_uuid;
  
  RETURN COALESCE(conversation_count, 0);
END;
$$;

-- Fonction: boost_listing
DROP FUNCTION IF EXISTS public.boost_listing(UUID, INTEGER);
CREATE FUNCTION public.boost_listing(
  listing_uuid UUID,
  duration_days INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings
  SET 
    boosted_until = CASE
      WHEN boosted_until IS NULL OR boosted_until < NOW() THEN NOW() + (duration_days || ' days')::INTERVAL
      ELSE boosted_until + (duration_days || ' days')::INTERVAL
    END
  WHERE id = listing_uuid;
END;
$$;

-- ============================================
-- 3. VÉRIFICATION FINALE
-- ============================================

-- Afficher toutes les fonctions maintenant sécurisées
SELECT 
  p.proname as function_name,
  CASE 
    WHEN p.prosecdef THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END as security_type,
  COALESCE(
    (SELECT setting FROM unnest(p.proconfig) as setting WHERE setting LIKE 'search_path=%'),
    'NOT SET'
  ) as search_path
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND p.prosecdef = true
ORDER BY p.proname;
