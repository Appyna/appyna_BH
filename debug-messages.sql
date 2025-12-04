-- Script de débogage pour la messagerie
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier les conversations des 4 nouveaux utilisateurs
SELECT 
  c.id,
  c.listing_id,
  u1.name as user1_name,
  u2.name as user2_name,
  c.created_at,
  c.updated_at
FROM conversations c
LEFT JOIN users u1 ON c.user1_id = u1.id
LEFT JOIN users u2 ON c.user2_id = u2.id
WHERE c.user1_id IN (
  '189251a6-beb3-4641-a3db-126d3132a1da',
  '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
  '992776de-0cb6-4ad4-8608-870e9c95e2b2',
  'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
)
OR c.user2_id IN (
  '189251a6-beb3-4641-a3db-126d3132a1da',
  '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
  '992776de-0cb6-4ad4-8608-870e9c95e2b2',
  'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
)
ORDER BY c.created_at DESC;

-- 2. Vérifier les messages existants
SELECT 
  m.id,
  m.conversation_id,
  u.name as sender_name,
  LEFT(m.text, 50) as text_preview,
  m.created_at
FROM messages m
LEFT JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id IN (
  SELECT id FROM conversations 
  WHERE user1_id IN (
    '189251a6-beb3-4641-a3db-126d3132a1da',
    '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
    '992776de-0cb6-4ad4-8608-870e9c95e2b2',
    'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
  )
  OR user2_id IN (
    '189251a6-beb3-4641-a3db-126d3132a1da',
    '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
    '992776de-0cb6-4ad4-8608-870e9c95e2b2',
    'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
  )
)
ORDER BY m.created_at DESC
LIMIT 20;

-- 3. Vérifier la fonction RPC restore_or_create_conversation
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'restore_or_create_conversation';

-- 4. Tester l'insertion d'un message (À ADAPTER avec de vraies valeurs)
-- ATTENTION: Remplacer les UUIDs par des valeurs réelles avant d'exécuter !
-- INSERT INTO messages (conversation_id, sender_id, text)
-- VALUES (
--   'UUID_CONVERSATION_REELLE',
--   'UUID_SENDER_REEL', 
--   'Message de test'
-- );
