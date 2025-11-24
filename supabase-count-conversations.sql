-- Fonction SQL SIMPLE pour compter les conversations avec messages reçus
-- Ne fait PAS de différence lu/non lu, juste "conversations actives avec dernier message reçu"

CREATE OR REPLACE FUNCTION count_conversations_with_received_messages(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Compter les conversations où le dernier message N'EST PAS envoyé par l'utilisateur
  SELECT COUNT(DISTINCT c.id)
  INTO v_count
  FROM conversations c
  INNER JOIN LATERAL (
    SELECT sender_id
    FROM messages
    WHERE conversation_id = c.id
    ORDER BY created_at DESC
    LIMIT 1
  ) latest_msg ON true
  WHERE 
    (c.user1_id = p_user_id OR c.user2_id = p_user_id)
    AND NOT (p_user_id = ANY(c.deleted_by))
    AND latest_msg.sender_id != p_user_id;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION count_conversations_with_received_messages IS 
  'Compte le nombre de conversations actives où le dernier message a été REÇU (pas envoyé par user)';
