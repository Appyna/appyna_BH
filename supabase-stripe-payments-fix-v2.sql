-- Fix définitif pour stripe_payments : permettre NULL sur stripe_payment_intent_id
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer la contrainte UNIQUE existante
ALTER TABLE stripe_payments 
DROP CONSTRAINT IF EXISTS stripe_payments_stripe_payment_intent_id_key;

-- 2. Permettre NULL sur stripe_payment_intent_id
ALTER TABLE stripe_payments 
ALTER COLUMN stripe_payment_intent_id DROP NOT NULL;

-- 3. Rendre stripe_session_id obligatoire (car on l'a toujours)
ALTER TABLE stripe_payments
ALTER COLUMN stripe_session_id SET NOT NULL;

-- 4. Ajouter UNIQUE sur stripe_session_id (pour éviter les doublons)
ALTER TABLE stripe_payments
DROP CONSTRAINT IF EXISTS stripe_payments_session_id_unique;

ALTER TABLE stripe_payments
ADD CONSTRAINT stripe_payments_session_id_unique UNIQUE (stripe_session_id);

-- 5. Optionnel : recréer l'index sur payment_intent_id (même s'il peut être NULL)
CREATE INDEX IF NOT EXISTS idx_stripe_payments_intent ON stripe_payments(stripe_payment_intent_id) 
WHERE stripe_payment_intent_id IS NOT NULL;
