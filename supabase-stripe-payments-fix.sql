-- Fix: Permettre stripe_payment_intent_id NULL pour la création de session
-- À exécuter dans Supabase SQL Editor

ALTER TABLE stripe_payments 
ALTER COLUMN stripe_payment_intent_id DROP NOT NULL;

-- Mettre stripe_session_id en UNIQUE et NOT NULL à la place
ALTER TABLE stripe_payments
ALTER COLUMN stripe_session_id SET NOT NULL;

ALTER TABLE stripe_payments
ADD CONSTRAINT stripe_payments_session_id_unique UNIQUE (stripe_session_id);
