-- ====================================
-- Fonction pour restaurer ou créer une conversation
-- Cette fonction bypasse les RLS policies pour pouvoir restaurer les conversations soft deleted
-- ====================================

DROP FUNCTION IF EXISTS restore_or_create_conversation(UUID, UUID, UUID);

CREATE OR REPLACE FUNCTION restore_or_create_conversation(
  p_listing_id UUID,
  p_user1_id UUID,
  p_user2_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id UUID;
  v_deleted_by UUID[];
BEGIN
  -- Chercher une conversation existante (même soft deleted) entre user et autre user
  -- avec ou sans listing (selon si p_listing_id est NULL)
  IF p_listing_id IS NULL THEN
    -- Conversation sans annonce
    SELECT id, deleted_by INTO v_conversation_id, v_deleted_by
    FROM conversations
    WHERE listing_id IS NULL
      AND (
        (user1_id = p_user1_id AND user2_id = p_user2_id)
        OR (user1_id = p_user2_id AND user2_id = p_user1_id)
      )
    LIMIT 1;
  ELSE
    -- Conversation avec annonce spécifique
    SELECT id, deleted_by INTO v_conversation_id, v_deleted_by
    FROM conversations
    WHERE listing_id = p_listing_id
      AND (
        (user1_id = p_user1_id AND user2_id = p_user2_id)
        OR (user1_id = p_user2_id AND user2_id = p_user1_id)
      )
    LIMIT 1;
  END IF;

  -- Si conversation trouvée
  IF v_conversation_id IS NOT NULL THEN
    -- Vérifier si p_user1_id l'a supprimée
    IF p_user1_id = ANY(v_deleted_by) THEN
      -- Retirer p_user1_id du tableau deleted_by
      UPDATE conversations
      SET deleted_by = array_remove(deleted_by, p_user1_id)
      WHERE id = v_conversation_id;
    END IF;
    
    RETURN v_conversation_id;
  END IF;

  -- Sinon, créer une nouvelle conversation
  INSERT INTO conversations (listing_id, user1_id, user2_id)
  VALUES (p_listing_id, p_user1_id, p_user2_id)
  RETURNING id INTO v_conversation_id;

  RETURN v_conversation_id;
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION restore_or_create_conversation TO authenticated;

-- Ajouter un commentaire descriptif
COMMENT ON FUNCTION restore_or_create_conversation IS 
  'Restaure une conversation existante (même soft deleted) ou en crée une nouvelle. Utilisé pour contacter un utilisateur.';
