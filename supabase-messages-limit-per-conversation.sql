-- Migration: Fonction pour récupérer les derniers messages par conversation (pagination messages)

-- Fonction pour récupérer les N derniers messages de plusieurs conversations
CREATE OR REPLACE FUNCTION get_latest_messages_by_conversations(
  conversation_ids UUID[],
  messages_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  text TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.conversation_id, m.sender_id, m.text, m.image_url, m.created_at
  FROM (
    SELECT 
      messages.*,
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
