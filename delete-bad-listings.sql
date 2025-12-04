-- Supprimer les 80 annonces avec les mauvaises catégories
DELETE FROM listings WHERE user_id IN (
  '189251a6-beb3-4641-a3db-126d3132a1da',
  '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
  '992776de-0cb6-4ad4-8608-870e9c95e2b2',
  'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
);

-- Vérifier que tout est supprimé
SELECT COUNT(*) as remaining FROM listings WHERE user_id IN (
  '189251a6-beb3-4641-a3db-126d3132a1da',
  '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
  '992776de-0cb6-4ad4-8608-870e9c95e2b2',
  'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
);
-- Doit afficher 0
