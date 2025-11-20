// Service pour tracker les paiements Stripe
import { supabase } from './supabaseClient';

export interface StripePayment {
  id: string;
  stripe_payment_intent_id: string;
  stripe_session_id?: string;
  user_id?: string;
  listing_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  boost_days?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Créer un nouveau paiement (après création Stripe Checkout)
 */
export async function createPayment(data: {
  stripe_payment_intent_id: string;
  stripe_session_id?: string;
  user_id: string;
  listing_id: string;
  amount: number;
  currency?: string;
  boost_days: number;
  metadata?: Record<string, any>;
}): Promise<StripePayment | null> {
  try {
    const { data: payment, error } = await supabase
      .from('stripe_payments')
      .insert({
        stripe_payment_intent_id: data.stripe_payment_intent_id,
        stripe_session_id: data.stripe_session_id,
        user_id: data.user_id,
        listing_id: data.listing_id,
        amount: data.amount,
        currency: data.currency || 'ils',
        status: 'pending',
        boost_days: data.boost_days,
        metadata: data.metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur createPayment:', error);
      return null;
    }

    return payment;
  } catch (error) {
    console.error('Erreur createPayment:', error);
    return null;
  }
}

/**
 * Mettre à jour le statut d'un paiement (webhook Stripe)
 */
export async function updatePaymentStatus(
  paymentIntentId: string,
  status: 'succeeded' | 'failed' | 'canceled'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('stripe_payments')
      .update({ status })
      .eq('stripe_payment_intent_id', paymentIntentId);

    if (error) {
      console.error('Erreur updatePaymentStatus:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur updatePaymentStatus:', error);
    return false;
  }
}

/**
 * Récupérer un paiement par PaymentIntent ID
 */
export async function getPaymentByIntentId(
  paymentIntentId: string
): Promise<StripePayment | null> {
  try {
    const { data, error } = await supabase
      .from('stripe_payments')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error) {
      console.error('Erreur getPaymentByIntentId:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur getPaymentByIntentId:', error);
    return null;
  }
}

/**
 * Récupérer tous les paiements d'un utilisateur
 */
export async function getUserPayments(userId: string): Promise<StripePayment[]> {
  try {
    const { data, error } = await supabase
      .from('stripe_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur getUserPayments:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getUserPayments:', error);
    return [];
  }
}

/**
 * Récupérer tous les paiements réussis (pour admin)
 */
export async function getAllSuccessfulPayments(): Promise<StripePayment[]> {
  try {
    const { data, error } = await supabase
      .from('stripe_payments')
      .select('*')
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur getAllSuccessfulPayments:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur getAllSuccessfulPayments:', error);
    return [];
  }
}

export const stripePaymentsService = {
  createPayment,
  updatePaymentStatus,
  getPaymentByIntentId,
  getUserPayments,
  getAllSuccessfulPayments,
};
