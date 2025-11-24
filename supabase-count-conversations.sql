-- Fonction SQL pour compter les conversations avec messages NON LUS
-- Vérifie si le dernier message est reçu ET non encore vu (basé sur lastSeen localStorage)

-- Supprimer l'ancienne version de la fonction (sans paramètres)
DROP FUNCTION IF EXISTS count_conversations_with_received_messages(UUID);

CREATE OR REPLACE FUNCTION count_conversations_with_received_messages(
  p_user_id UUID,
  p_last_seen_data JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Compter les conversations où:
  -- 1. Le dernier message N'EST PAS envoyé par l'utilisateur
  -- 2. ET ce message n'a pas été vu (pas dans lastSeen ou différent)
  SELECT COUNT(DISTINCT c.id)
  INTO v_count
  FROM conversations c
  INNER JOIN LATERAL (
    SELECT id as message_id, sender_id
    FROM messages
    WHERE conversation_id = c.id
    ORDER BY created_at DESC
    LIMIT 1
  ) latest_msg ON true
  WHERE 
    (c.user1_id = p_user_id OR c.user2_id = p_user_id)
    AND NOT (p_user_id = ANY(c.deleted_by))
    AND latest_msg.sender_id != p_user_id
    -- Vérifier si ce message est différent du dernier vu (localStorage)
    AND (
      p_last_seen_data->>c.id::text IS NULL 
      OR p_last_seen_data->>c.id::text != latest_msg.message_id::text
    );
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION count_conversations_with_received_messages IS 
  'Compte les conversations où le dernier message a été REÇU et NON LU (basé sur localStorage lastSeen_)';
