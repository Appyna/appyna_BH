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
    console.log('1. Starting create-checkout-session')
    const { listingId, userId, duration = 7 } = await req.json()
    console.log('2. Received params:', { listingId, userId, duration })

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
    console.log('3. Creating Stripe session with amount:', amount)

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
      payment_method_types: ['card'],
      success_url: `${req.headers.get('origin')}/boost/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/boost/cancel`,
      metadata: {
        listingId,
        userId,
        duration: duration.toString(),
      },
    })
    console.log('4. Stripe session created:', session.id)

    // 🆕 NOUVEAU : Insérer le paiement dans la base de données avec status 'pending'
    console.log('5. Attempting to insert payment record...')
    try {
      const paymentData = {
        stripe_session_id: session.id,
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
      }
      console.log('6. Payment data to insert:', JSON.stringify(paymentData))
      
      const { error: insertError } = await supabase
        .from('stripe_payments')
        .insert(paymentData)

      if (insertError) {
        console.error('7. Error inserting payment record:', JSON.stringify(insertError))
        // Ne pas bloquer la création de session si l'insertion échoue
      } else {
        console.log('7. Payment record created successfully')
      }
    } catch (dbError: any) {
      console.error('7. Database exception:', dbError?.message || dbError)
      // Ne pas bloquer la création de session
    }

    console.log('8. Returning success response')
    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('ERROR in create-checkout-session:', error?.message || error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
