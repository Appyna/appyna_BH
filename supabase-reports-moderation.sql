-- Migration: Système de signalement et modération

-- 1. Créer la table reports pour les signalements
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'scam', 'duplicate', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  moderator_id UUID REFERENCES users(id),
  moderator_note TEXT
);

-- 2. Ajouter colonne is_admin dans users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 3. Ajouter colonne is_banned dans users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- 4. Ajouter colonne is_hidden dans listings (pour masquer sans supprimer)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- 5. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_listing ON reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_listings_hidden ON listings(is_hidden);
CREATE INDEX IF NOT EXISTS idx_users_banned ON users(is_banned);

-- 6. Policies pour la table reports

-- Les utilisateurs peuvent créer des signalements
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Les utilisateurs peuvent voir leurs propres signalements
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Les admins peuvent tout voir et modifier
CREATE POLICY "Admins can view all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- 7. Modifier la policy des listings pour exclure les annonces masquées
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT
  USING (
    is_hidden = FALSE 
    OR auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- 8. Fonction pour mettre à jour le timestamp updated_at automatiquement
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reports_updated_at_trigger
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_reports_updated_at();

-- 9. Activer RLS sur reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 10. Commentaires pour documentation
COMMENT ON TABLE reports IS 'Signalements d''annonces par les utilisateurs';
COMMENT ON COLUMN reports.reason IS 'Raison du signalement: spam, inappropriate, scam, duplicate, other';
COMMENT ON COLUMN reports.status IS 'Statut: pending (en attente), resolved (traité/accepté), rejected (rejeté)';
COMMENT ON COLUMN users.is_admin IS 'Indique si l''utilisateur est administrateur';
COMMENT ON COLUMN users.is_banned IS 'Indique si l''utilisateur est banni';
COMMENT ON COLUMN listings.is_hidden IS 'Indique si l''annonce est masquée (suite à modération)';
