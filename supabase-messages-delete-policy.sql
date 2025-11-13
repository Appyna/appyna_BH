-- Migration: Ajouter DELETE policy pour les messages

-- Les utilisateurs peuvent supprimer leurs propres messages
CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Optionnel: Permettre la suppression des messages dans les conversations où l'utilisateur est participant
-- (pour une suppression complète de conversation)
CREATE POLICY "Users can delete messages in their conversations"
  ON messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (auth.uid() = conversations.user1_id OR auth.uid() = conversations.user2_id)
    )
  );
