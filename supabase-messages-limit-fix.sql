-- Migration: Fix fonction get_latest_messages_by_conversations (sans image_url)

-- Supprimer l'ancienne version si elle existe
DROP FUNCTION IF EXISTS get_latest_messages_by_conversations(UUID[], INT);

-- Recréer avec seulement les colonnes qui existent
CREATE OR REPLACE FUNCTION get_latest_messages_by_conversations(
  conversation_ids UUID[],
  messages_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  text TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.conversation_id, m.sender_id, m.text, m.created_at
  FROM (
    SELECT 
      messages.id,
      messages.conversation_id,
      messages.sender_id,
      messages.text,
      messages.created_at,
      ROW_NUMBER() OVER (PARTITION BY messages.conversation_id ORDER BY messages.created_at DESC) as rn
    FROM messages
    WHERE messages.conversation_id = ANY(conversation_ids)
  ) m
  WHERE m.rn <= messages_limit
  ORDER BY m.conversation_id, m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute à authenticated users
GRANT EXECUTE ON FUNCTION get_latest_messages_by_conversations(UUID[], INT) TO authenticated;
