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

    const priceMap: Record<number, number> = {
      1: 990,
      3: 2490,
      7: 3990,
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