-- Fonction pour restaurer ou créer une conversation de support
-- Cette fonction bypasse les RLS policies pour pouvoir restaurer les conversations soft deleted

CREATE OR REPLACE FUNCTION restore_or_create_support_conversation(
  p_user_id UUID,
  p_admin_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_deleted_by UUID[];
BEGIN
  -- Chercher une conversation existante (même soft deleted) entre user et admin sans listing
  SELECT id, deleted_by INTO v_conversation_id, v_deleted_by
  FROM conversations
  WHERE listing_id IS NULL
    AND (
      (user1_id = p_user_id AND user2_id = p_admin_id) OR
      (user1_id = p_admin_id AND user2_id = p_user_id)
    )
  LIMIT 1;

  -- Si la conversation existe
  IF v_conversation_id IS NOT NULL THEN
    -- Si elle a été supprimée par l'utilisateur, la restaurer
    IF p_user_id = ANY(v_deleted_by) THEN
      UPDATE conversations
      SET deleted_by = array_remove(deleted_by, p_user_id),
          updated_at = NOW()
      WHERE id = v_conversation_id;
    ELSE
      -- Juste mettre à jour le timestamp
      UPDATE conversations
      SET updated_at = NOW()
      WHERE id = v_conversation_id;
    END IF;
    
    RETURN v_conversation_id;
  ELSE
    -- Créer une nouvelle conversation
    INSERT INTO conversations (user1_id, user2_id, listing_id, deleted_by)
    VALUES (
      LEAST(p_user_id, p_admin_id),
      GREATEST(p_user_id, p_admin_id),
      NULL,
      '{}'
    )
    RETURNING id INTO v_conversation_id;
    
    RETURN v_conversation_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaire explicatif
COMMENT ON FUNCTION restore_or_create_support_conversation IS 
  'Restaure une conversation de support existante (même soft deleted) ou en crée une nouvelle. Utilisé pour le formulaire de contact.';
