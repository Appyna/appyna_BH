// Edge Function: stripe-webhook
// À copier dans Supabase Dashboard → Functions → stripe-webhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log('Webhook event received:', event.type)

    // Gérer l'événement checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { listingId, duration } = session.metadata || {}

      if (listingId && duration) {
        const durationDays = parseInt(duration)
        const boostedUntil = new Date()
        boostedUntil.setDate(boostedUntil.getDate() + durationDays)

        // Mettre à jour l'annonce dans Supabase
        const { error: listingError } = await supabase
          .from('listings')
          .update({ 
            boosted_until: boostedUntil.toISOString(),
            boosted_at: new Date().toISOString(),
          })
          .eq('id', listingId)

        if (listingError) {
          console.error('Error updating listing:', listingError)
        } else {
          console.log(`Listing ${listingId} boosted until ${boostedUntil.toISOString()}`)
        }

        // 🆕 NOUVEAU : Mettre à jour le statut du paiement à 'succeeded'
        const { error: paymentError } = await supabase
          .from('stripe_payments')
          .update({ 
            status: 'succeeded',
            stripe_payment_intent_id: session.payment_intent as string,
            metadata: {
              session_completed_at: new Date().toISOString(),
              payment_status: session.payment_status,
            }
          })
          .eq('stripe_session_id', session.id)

        if (paymentError) {
          console.error('Error updating payment status:', paymentError)
        } else {
          console.log(`Payment for session ${session.id} marked as succeeded`)
        }
      }
    }

    // 🆕 NOUVEAU : Gérer l'échec de paiement
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      const { error } = await supabase
        .from('stripe_payments')
        .update({ 
          status: 'failed',
          metadata: {
            failed_at: new Date().toISOString(),
            failure_message: paymentIntent.last_payment_error?.message,
          }
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      if (error) {
        console.error('Error updating failed payment:', error)
      } else {
        console.log(`Payment ${paymentIntent.id} marked as failed`)
      }
    }

    // 🆕 NOUVEAU : Gérer l'annulation de paiement
    if (event.type === 'payment_intent.canceled') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      const { error } = await supabase
        .from('stripe_payments')
        .update({ 
          status: 'canceled',
          metadata: {
            canceled_at: new Date().toISOString(),
            cancellation_reason: paymentIntent.cancellation_reason,
          }
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      if (error) {
        console.error('Error updating canceled payment:', error)
      } else {
        console.log(`Payment ${paymentIntent.id} marked as canceled`)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
