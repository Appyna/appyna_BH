-- Migration: Cleanup de la colonne read_at inutilisée

-- Supprimer l'index sur read_at
DROP INDEX IF EXISTS idx_messages_unread;

-- Supprimer la fonction RPC inutilisée
DROP FUNCTION IF EXISTS mark_conversation_messages_as_read(UUID, UUID);

-- Supprimer la policy inutilisée
DROP POLICY IF EXISTS "Users can mark messages as read in their conversations" ON messages;

-- Supprimer la colonne read_at
ALTER TABLE messages 
DROP COLUMN IF EXISTS read_at;
