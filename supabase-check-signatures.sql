-- Vérifier les signatures exactes des fonctions dupliquées restantes
SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as signature,
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
  AND p.proname IN (
    'count_conversations_with_received_messages',
    'get_latest_messages_by_conversations',
    'restore_or_create_support_conversation'
  )
ORDER BY p.proname, search_path;
