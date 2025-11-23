-- Migration pour permettre les conversations de support sans listing_id
-- Les conversations de support (avec l'admin) n'ont pas besoin d'annonce associée

-- Rendre listing_id nullable pour les conversations de support
ALTER TABLE conversations 
ALTER COLUMN listing_id DROP NOT NULL;

-- Ajouter une contrainte pour s'assurer que listing_id est null SEULEMENT pour les conversations avec l'admin
-- (l'admin a l'email projet.lgsz@gmail.com et l'ID 91c84b9e-376e-45c1-84f7-329476e9e5eb)
-- On ne peut pas référencer directement users.email dans une contrainte CHECK, 
-- donc on accepte listing_id NULL pour toute conversation

-- Mettre à jour l'index unique pour permettre plusieurs conversations de support
-- (une par utilisateur avec l'admin, sans listing)
DROP INDEX IF EXISTS idx_conversations_unique;
DROP INDEX IF EXISTS idx_conversations_unique_with_listing;
DROP INDEX IF EXISTS idx_conversations_unique_support;

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_with_listing 
  ON conversations (listing_id, LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
  WHERE listing_id IS NOT NULL;

-- Index pour les conversations de support (sans listing)
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_support 
  ON conversations (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
  WHERE listing_id IS NULL;

-- Commentaire explicatif
COMMENT ON COLUMN conversations.listing_id IS 
  'ID de l''annonce concernée. NULL pour les conversations de support avec l''équipe Appyna.';
