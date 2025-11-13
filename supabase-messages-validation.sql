-- Migration: Ajouter validation de longueur de message côté serveur

-- Ajouter contrainte de longueur maximale pour les messages
ALTER TABLE messages 
ADD CONSTRAINT check_message_length 
CHECK (length(text) > 0 AND length(text) <= 5000);

-- Ajouter contrainte pour empêcher les messages vides (après trim)
ALTER TABLE messages 
ADD CONSTRAINT check_message_not_empty 
CHECK (trim(text) <> '');
