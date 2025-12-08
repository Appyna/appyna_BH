import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined');
      return Promise.resolve(null);
    }
    console.log('Stripe key loaded:', key?.substring(0, 12)); // Debug log
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
