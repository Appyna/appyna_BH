-- ====================================
-- CORRECTION TRI DES ANNONCES
-- Fix l'ordre d'affichage : boostées en premier, puis chronologique
-- ====================================

-- Étape 1 : Créer un index composite pour optimiser le tri
-- Cet index permet de trier rapidement par : date d'expiration boost → date de boost → date de création
DROP INDEX IF EXISTS idx_listings_sort_order;
CREATE INDEX idx_listings_sort_order ON public.listings (
  boosted_until DESC NULLS LAST,
  boosted_at DESC NULLS LAST,
  created_at DESC
) WHERE is_hidden = false;

-- Note : On n'utilise pas de colonne calculée car NOW() n'est pas immutable
-- Le tri se fait directement dans les requêtes avec boosted_until

-- Étape 2 : Vérifier que le tri fonctionne correctement
-- Cette requête montre les 10 premières annonces dans le bon ordre
SELECT 
  id,
  title,
  boosted_at,
  boosted_until,
  created_at,
  CASE 
    WHEN boosted_until IS NOT NULL AND boosted_until > NOW() THEN 'Boosté actif'
    WHEN boosted_until IS NOT NULL AND boosted_until < NOW() THEN 'Boost expiré'
    ELSE 'Non boosté'
  END as status
FROM public.listings
WHERE is_hidden = false
ORDER BY 
  boosted_until DESC NULLS LAST,
  boosted_at DESC NULLS LAST,
  created_at DESC
LIMIT 10;

-- ====================================
-- RÉSULTAT ATTENDU :
-- 1. Annonces avec boost actif (boosted_until > NOW()) en premier
--    Triées par boosted_until DESC puis boosted_at DESC
-- 2. Puis annonces avec boost expiré
-- 3. Puis annonces non boostées (boosted_until IS NULL)
--    Triées par date de création (plus récent en premier)
-- 
-- Le tri par boosted_until DESC avec NULLS LAST garantit que :
-- - Les boosts actifs avec date future sont en haut
-- - Triés du plus loin (plus récemment boosté) au plus proche
-- - Les boosts expirés sont au milieu
-- - Les non-boostés (NULL) sont à la fin
-- ====================================
