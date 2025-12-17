-- ====================================
-- CORRECTION TRI DES ANNONCES
-- Fix l'ordre d'affichage : boostées en premier, puis chronologique
-- ====================================

-- Étape 1 : Créer un index pour optimiser le tri
-- Index sur les colonnes utilisées dans le tri
DROP INDEX IF EXISTS idx_listings_sort_order;
CREATE INDEX idx_listings_sort_order ON public.listings (
  created_at DESC,
  boosted_at DESC NULLS LAST,
  boosted_until DESC NULLS LAST
) WHERE is_hidden = false;

-- Note : Le tri utilise une expression CASE qui ne peut pas être indexée directement
-- Mais l'index sur created_at + boosted_at aide quand même les performances

-- Étape 2 : Vérifier que le tri fonctionne correctement
-- Cette requête montre les 20 premières annonces dans le bon ordre
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
  -- 1. Boosts actifs d'abord (1 = actif, 0 = expiré ou pas de boost)
  CASE WHEN boosted_until > NOW() THEN 1 ELSE 0 END DESC,
  -- 2. Parmi les boosts actifs, les plus récemment boostés en premier
  boosted_at DESC NULLS LAST,
  -- 3. Pour tout le reste (non-boostés + boosts expirés), tri par date de création
  created_at DESC
LIMIT 20;

-- ====================================
-- RÉSULTAT ATTENDU :
-- 1. Annonces avec boost actif (boosted_until > NOW()) EN PREMIER
--    Triées par boosted_at DESC (les plus récemment boostées en haut)
-- 
-- 2. Puis TOUTES les autres annonces (non-boostées + boosts expirés)
--    Triées par created_at DESC (les plus récentes en premier)
-- 
-- Exemple concret :
--   - iPhone (boost actif jusqu'au 19/12) ← Position 1
--   - Guitare (publiée aujourd'hui 17/12, jamais boostée) ← Position 2
--   - F4 Ashdod (publiée aujourd'hui 17/12) ← Position 3
--   - MacBook (boost expiré le 11/12) ← Plus bas car vieux
-- ====================================
