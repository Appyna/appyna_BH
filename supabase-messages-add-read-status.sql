-- Migration: Ajouter le statut de lecture aux messages

-- Ajouter la colonne read_at à la table messages
ALTER TABLE messages 
ADD COLUMN read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Index pour rechercher rapidement les messages non lus
CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON messages (conversation_id, read_at) 
WHERE read_at IS NULL;

-- Fonction pour marquer tous les messages d'une conversation comme lus
CREATE OR REPLACE FUNCTION mark_conversation_messages_as_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE messages
  SET read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy pour permettre aux utilisateurs de mettre à jour read_at
CREATE POLICY "Users can mark messages as read in their conversations"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (auth.uid() = conversations.user1_id OR auth.uid() = conversations.user2_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (auth.uid() = conversations.user1_id OR auth.uid() = conversations.user2_id)
    )
  );
