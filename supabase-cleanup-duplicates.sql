-- Nettoyer les anciennes versions des fonctions dupliquées

-- Supprimer les anciennes versions sans search_path
DROP FUNCTION IF EXISTS public.count_conversations_with_received_messages(UUID);
DROP FUNCTION IF EXISTS public.get_latest_messages_by_conversations(UUID);
DROP FUNCTION IF EXISTS public.restore_or_create_support_conversation(UUID);

-- Afficher le résultat final
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
