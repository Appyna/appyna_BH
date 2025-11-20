-- Migration: Système de signalement d'utilisateurs

-- 1. Créer la table user_reports pour les signalements d'utilisateurs
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  moderator_id UUID REFERENCES users(id),
  moderator_note TEXT
);

-- 2. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported_user ON user_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter ON user_reports(reporter_id);

-- 3. Policies RLS pour la table user_reports

-- Les utilisateurs peuvent créer des signalements
CREATE POLICY "Users can create user reports"
  ON user_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Les utilisateurs peuvent voir leurs propres signalements
CREATE POLICY "Users can view their own user reports"
  ON user_reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Les admins peuvent tout voir et modifier
CREATE POLICY "Admins can view all user reports"
  ON user_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update user reports"
  ON user_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- 4. Fonction pour mettre à jour le timestamp updated_at automatiquement
CREATE OR REPLACE FUNCTION update_user_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_reports_updated_at_trigger
  BEFORE UPDATE ON user_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reports_updated_at();

-- 5. Activer RLS sur user_reports
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- 6. Commentaires pour documentation
COMMENT ON TABLE user_reports IS 'Signalements d''utilisateurs par d''autres utilisateurs';
COMMENT ON COLUMN user_reports.reason IS 'Raison du signalement (texte libre)';
COMMENT ON COLUMN user_reports.status IS 'Statut: pending (en attente), resolved (traité/banni), rejected (rejeté)';
