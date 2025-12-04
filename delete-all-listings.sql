-- Suppression de TOUTES les annonces (listings)
-- Les utilisateurs (users) ne seront PAS supprimés
-- Exécuter ce script dans Supabase SQL Editor

-- Désactiver temporairement RLS pour la suppression
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les annonces
DELETE FROM listings;

-- Réactiver RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Vérification : doit retourner 0
SELECT COUNT(*) as total_listings FROM listings;

-- Vérification : les utilisateurs sont toujours là
SELECT id, name, email FROM users ORDER BY name;
