-- Migration: Table pour tracker les paiements Stripe

-- 1. Créer la table stripe_payments
CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_session_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ils',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  boost_days INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_stripe_payments_user ON stripe_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_listing ON stripe_payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_status ON stripe_payments(status);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_created ON stripe_payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_intent ON stripe_payments(stripe_payment_intent_id);

-- 3. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_stripe_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stripe_payments_updated_at_trigger
  BEFORE UPDATE ON stripe_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_stripe_payments_updated_at();

-- 4. Policies RLS pour stripe_payments

-- Les utilisateurs peuvent voir leurs propres paiements
CREATE POLICY "Users can view their own payments"
  ON stripe_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all payments"
  ON stripe_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- Seul le système peut insérer (via service role ou webhook)
-- Note: Les webhooks Stripe utilisent la service role key
CREATE POLICY "System can insert payments"
  ON stripe_payments FOR INSERT
  WITH CHECK (true);

-- Seul le système peut mettre à jour
CREATE POLICY "System can update payments"
  ON stripe_payments FOR UPDATE
  USING (true);

-- 5. Activer RLS
ALTER TABLE stripe_payments ENABLE ROW LEVEL SECURITY;

-- 6. Commentaires pour documentation
COMMENT ON TABLE stripe_payments IS 'Table pour tracker tous les paiements Stripe (boosts, etc.)';
COMMENT ON COLUMN stripe_payments.stripe_payment_intent_id IS 'ID du PaymentIntent Stripe (unique)';
COMMENT ON COLUMN stripe_payments.stripe_session_id IS 'ID de la Session Checkout Stripe';
COMMENT ON COLUMN stripe_payments.amount IS 'Montant en shekels (ILS)';
COMMENT ON COLUMN stripe_payments.status IS 'Statut: pending, succeeded, failed, canceled';
COMMENT ON COLUMN stripe_payments.boost_days IS 'Nombre de jours de boost (7 ou 30)';
COMMENT ON COLUMN stripe_payments.metadata IS 'Métadonnées additionnelles du paiement';
