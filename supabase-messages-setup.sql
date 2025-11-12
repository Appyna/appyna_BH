-- Supprimer les tables existantes si elles existent (pour éviter les conflits de schéma)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- Table: conversations
-- Stocke les conversations entre utilisateurs pour des annonces spécifiques

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Index pour rechercher rapidement les conversations d'un utilisateur
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations (user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations (user2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_listing ON conversations (listing_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations (updated_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique ON conversations (listing_id, LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

-- Table: messages
-- Stocke les messages individuels dans les conversations

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour récupérer rapidement les messages d'une conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id);

-- Activer Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies pour conversations
-- Les utilisateurs peuvent voir les conversations dont ils sont participants
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Les utilisateurs peuvent créer des conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Les utilisateurs peuvent mettre à jour leurs conversations
CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies pour messages
-- Les utilisateurs peuvent voir les messages des conversations dont ils sont participants
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (auth.uid() = conversations.user1_id OR auth.uid() = conversations.user2_id)
    )
  );

-- Les utilisateurs peuvent envoyer des messages dans leurs conversations
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (auth.uid() = conversations.user1_id OR auth.uid() = conversations.user2_id)
    )
  );

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at quand un nouveau message est ajouté
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();
