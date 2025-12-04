-- Fix du trigger qui bloque l'insertion de messages
-- Le problème : le trigger essaie de mettre à jour NEW.updated_at sur messages (qui n'existe pas)
-- La solution : Le trigger doit mettre à jour conversations.updated_at, pas messages.updated_at

-- 1. Supprimer l'ancien trigger défectueux
DROP TRIGGER IF EXISTS update_conversations_timestamp ON messages;

-- 2. Recréer la fonction correctement
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour updated_at de la CONVERSATION (pas du message)
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer le trigger qui appelle cette fonction APRÈS insertion
CREATE TRIGGER update_conversations_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();

-- 4. Test d'insertion
INSERT INTO messages (conversation_id, sender_id, text)
VALUES (
  '1daa3704-58ce-42a0-ac4b-5f2230582028',
  '189251a6-beb3-4641-a3db-126d3132a1da',
  'Test message from Sandrine - trigger fixed!'
);

-- 5. Vérifier que ça a marché
SELECT 
  m.id,
  m.conversation_id,
  u.name as sender_name,
  m.text,
  m.created_at
FROM messages m
LEFT JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id = '1daa3704-58ce-42a0-ac4b-5f2230582028'
ORDER BY m.created_at DESC;
