# Supabase Edge Functions pour Stripe

## 📝 Instructions de création

Vous devez créer 2 Edge Functions dans votre dashboard Supabase :

---

## 1️⃣ Edge Function: `create-checkout-session`

**Chemin**: Functions → Create a new function → Nom: `create-checkout-session`

**Code**:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

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
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ils',
            product_data: {
              name: `Boost d'annonce - ${duration} jours`,
              description: 'Mettez votre annonce en avant',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
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
```

---

## 2️⃣ Edge Function: `stripe-webhook`

**Chemin**: Functions → Create a new function → Nom: `stripe-webhook`

**Code**:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'
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

    // Gérer l'événement checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { listingId, duration } = session.metadata || {}

      if (listingId && duration) {
        const durationDays = parseInt(duration)
        const boostedUntil = new Date()
        boostedUntil.setDate(boostedUntil.getDate() + durationDays)

        // Mettre à jour l'annonce dans Supabase
        const { error } = await supabase
          .from('listings')
          .update({ 
            boosted_until: boostedUntil.toISOString(),
          })
          .eq('id', listingId)

        if (error) {
          console.error('Error updating listing:', error)
          throw error
        }

        console.log(`Listing ${listingId} boosted until ${boostedUntil.toISOString()}`)
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
```

---

## ⚙️ Configuration des secrets

Dans Supabase Dashboard → Settings → Edge Functions → Manage secrets, ajoutez :

1. `STRIPE_SECRET_KEY`: Votre clé secrète Stripe (commence par `sk_test_...`)
2. `STRIPE_WEBHOOK_SECRET`: Votre secret webhook (commence par `whsec_...`)
3. `SUPABASE_SERVICE_ROLE_KEY`: Déjà configuré normalement

---

## 🔗 Configuration Webhook Stripe

1. Allez sur https://dashboard.stripe.com/test/webhooks
2. Cliquez sur "Add endpoint"
3. URL: `https://nbtdowycvyogjopcidjq.supabase.co/functions/v1/stripe-webhook`
4. Events to listen: Sélectionnez `checkout.session.completed`
5. Copiez le "Signing secret" (whsec_...) et ajoutez-le dans les secrets Supabase

---

## ✅ Test

Une fois créées, testez avec :
```bash
curl -X POST https://nbtdowycvyogjopcidjq.supabase.co/functions/v1/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"listingId": "test-id", "userId": "test-user", "duration": 7}'
```
