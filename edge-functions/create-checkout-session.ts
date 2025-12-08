import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { listingId, userId, duration = 7 } = await req.json()

    if (!listingId || !userId) {
      throw new Error('listingId and userId are required')
    }

    // Prix en centimes d'euro (conversion depuis shekels)
    // 9.90₪ ≈ 2.79€ | 24.90₪ ≈ 6.79€ | 39.90₪ ≈ 10.99€
    const priceMap: Record<number, number> = {
      1: 279,   // 2.79€
      3: 679,   // 6.79€
      7: 1099,  // 10.99€
    }

    const amount = priceMap[duration] || 279

    // Affichage du prix en shekels pour le client
    const shekelPrices: Record<number, string> = {
      1: '9.90₪',
      3: '24.90₪',
      7: '39.90₪',
    }
    const shekelPrice = shekelPrices[duration] || '9.90₪'

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Boost d'annonce ${shekelPrice} - ${duration} jour${duration > 1 ? 's' : ''}`,
              description: 'Mise en avant de votre annonce',
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