// Edge Function: create-checkout-session
// À copier dans Supabase Dashboard → Functions → create-checkout-session

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { listingId, userId, duration = 7 } = await req.json()

    if (!listingId || !userId) {
      throw new Error('listingId and userId are required')
    }

    // Prix selon la durée (en agorot - centimes ILS)
    const priceMap: Record<number, number> = {
      1: 990,   // 9.90 ILS pour 1 jour
      3: 2490,  // 24.90 ILS pour 3 jours
      7: 3990,  // 39.90 ILS pour 7 jours
    }

    const amount = priceMap[duration] || 990

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'ils',
            product_data: {
              name: `Boost d'annonce - ${duration} jour${duration > 1 ? 's' : ''}`,
              description: 'Mettez votre annonce en avant',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      automatic_payment_methods: {
        enabled: true,
      },
      success_url: `${req.headers.get('origin')}/boost/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/boost/cancel`,
      metadata: {
        listingId,
        userId,
        duration: duration.toString(),
      },
    })

    // 🆕 NOUVEAU : Insérer le paiement dans la base de données avec status 'pending'
    const { error: insertError } = await supabase
      .from('stripe_payments')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string || null,
        user_id: userId,
        listing_id: listingId,
        amount: amount / 100, // Convertir les agorot en ILS
        currency: 'ils',
        status: 'pending',
        boost_days: duration,
        metadata: {
          session_url: session.url,
          created_at: new Date().toISOString(),
        }
      })

    if (insertError) {
      console.error('Error inserting payment record:', insertError)
      // Ne pas bloquer la création de session si l'insertion échoue
    }

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
