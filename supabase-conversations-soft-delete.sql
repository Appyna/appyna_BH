-- Migration: Ajouter le soft delete pour les conversations

-- Ajouter une colonne pour tracker les utilisateurs qui ont supprimé la conversation
ALTER TABLE conversations 
ADD COLUMN deleted_by UUID[] DEFAULT '{}';

-- Index pour rechercher rapidement les conversations non supprimées par un utilisateur
CREATE INDEX IF NOT EXISTS idx_conversations_deleted_by 
ON conversations USING GIN (deleted_by);

-- Fonction pour marquer une conversation comme supprimée par un utilisateur
CREATE OR REPLACE FUNCTION soft_delete_conversation(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE conversations
  SET deleted_by = array_append(deleted_by, p_user_id)
  WHERE id = p_conversation_id
    AND NOT (p_user_id = ANY(deleted_by)); -- Éviter les doublons
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mettre à jour la policy pour exclure les conversations supprimées
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (
    (auth.uid() = user1_id OR auth.uid() = user2_id)
    AND NOT (auth.uid() = ANY(deleted_by))
  );

-- Policy pour permettre aux utilisateurs de soft delete leurs conversations
CREATE POLICY "Users can soft delete their conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
