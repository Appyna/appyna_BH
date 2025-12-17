-- ====================================
-- CORRECTION TRI DES ANNONCES
-- Fix l'ordre d'affichage : boostées en premier, puis chronologique
-- ====================================

-- Étape 1 : Ajouter une colonne calculée pour savoir si le boost est actif
-- Cette colonne se met à jour automatiquement
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS is_boost_active BOOLEAN 
GENERATED ALWAYS AS (
  boosted_until IS NOT NULL AND boosted_until > NOW()
) STORED;

-- Étape 2 : Créer un index composite pour optimiser le tri
-- Cet index permet de trier rapidement par : boost actif → date de boost → date de création
DROP INDEX IF EXISTS idx_listings_sort_order;
CREATE INDEX idx_listings_sort_order ON public.listings (
  is_boost_active DESC NULLS LAST,
  boosted_at DESC NULLS LAST,
  created_at DESC
) WHERE is_hidden = false;

-- Étape 3 : Vérifier que la colonne fonctionne correctement
-- Cette requête montre les 10 premières annonces dans le bon ordre
SELECT 
  id,
  title,
  is_boost_active,
  boosted_at,
  boosted_until,
  created_at,
  CASE 
    WHEN is_boost_active THEN 'Boosté actif'
    WHEN boosted_until IS NOT NULL AND boosted_until < NOW() THEN 'Boost expiré'
    ELSE 'Non boosté'
  END as status
FROM public.listings
WHERE is_hidden = false
ORDER BY 
  is_boost_active DESC NULLS LAST,
  boosted_at DESC NULLS LAST,
  created_at DESC
LIMIT 10;

-- ====================================
-- RÉSULTAT ATTENDU :
-- 1. Toutes les annonces avec boost actif (is_boost_active = true)
--    Triées par date de boost (plus récent en premier)
-- 2. Puis toutes les annonces non boostées
--    Triées par date de création (plus récent en premier)
-- ====================================
