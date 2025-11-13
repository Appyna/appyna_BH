-- Migration: Ajouter système de boost pour les annonces

-- Ajouter colonne boosted_until (date d'expiration du boost)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMPTZ DEFAULT NULL;

-- Index pour rechercher rapidement les annonces boostées
CREATE INDEX IF NOT EXISTS idx_listings_boosted 
ON listings (boosted_until DESC NULLS LAST);

-- Fonction pour booster une annonce
CREATE OR REPLACE FUNCTION boost_listing(
  p_listing_id UUID,
  p_days INT
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  new_boosted_until TIMESTAMPTZ;
BEGIN
  -- Calculer la nouvelle date d'expiration
  new_boosted_until := NOW() + (p_days || ' days')::INTERVAL;
  
  -- Mettre à jour l'annonce
  UPDATE listings
  SET boosted_until = new_boosted_until
  WHERE id = p_listing_id;
  
  RETURN new_boosted_until;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute à authenticated users
GRANT EXECUTE ON FUNCTION boost_listing(UUID, INT) TO authenticated;
