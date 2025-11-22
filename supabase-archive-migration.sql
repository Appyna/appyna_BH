-- Migration pour ajouter la fonctionnalité d'archivage des conversations

-- Ajouter une colonne archived pour marquer les conversations archivées
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Index pour filtrer rapidement les conversations archivées
CREATE INDEX IF NOT EXISTS idx_conversations_archived 
  ON conversations (archived, updated_at DESC);

-- Ajouter une colonne pour tracker la dernière lecture par chaque participant
-- Cela permettra de savoir si une conversation a des messages non lus
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS user1_last_read_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS user2_last_read_at TIMESTAMP WITH TIME ZONE;

-- Commentaires explicatifs
COMMENT ON COLUMN conversations.archived IS 
  'Indique si la conversation est archivée (masquée de la vue principale)';
COMMENT ON COLUMN conversations.user1_last_read_at IS 
  'Dernière fois que user1 a lu la conversation';
COMMENT ON COLUMN conversations.user2_last_read_at IS 
  'Dernière fois que user2 a lu la conversation';
