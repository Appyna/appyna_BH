# 🔄 Mise à jour de l'Edge Function pour le tracking Stripe

## ⚠️ Action requise : Mettre à jour l'Edge Function `create-checkout-session`

Maintenant que la table `stripe_payments` existe, il faut mettre à jour l'Edge Function Supabase pour enregistrer les paiements.

### 📝 Modifications à apporter

#### Dans `supabase/functions/create-checkout-session/index.ts` :

```typescript
// AJOUTER après la création de la session Stripe et AVANT de retourner l'URL

// Enregistrer le paiement dans la base de données
try {
  await supabaseAdmin
    .from('stripe_payments')
    .insert({
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_session_id: session.id,
      user_id: userId,
      listing_id: listingId,
      amount: session.amount_total! / 100, // Convertir centimes en shekels
      currency: 'ils',
      status: 'pending',
      boost_days: duration === 1 ? 7 : 30,
      metadata: {
        listing_title: listingTitle, // Si disponible
        duration: duration,
      },
    });
  
  console.log('✅ Paiement enregistré dans stripe_payments');
} catch (error) {
  console.error('❌ Erreur lors de l\'enregistrement du paiement:', error);
  // Ne pas bloquer le processus si l'enregistrement échoue
}
```

#### Dans `supabase/functions/stripe-webhook/index.ts` :

```typescript
// AJOUTER dans le cas 'checkout.session.completed' :

case 'checkout.session.completed':
  const session = event.data.object as Stripe.Checkout.Session;
  
  // Mettre à jour le statut du paiement
  try {
    await supabaseAdmin
      .from('stripe_payments')
      .update({ status: 'succeeded' })
      .eq('stripe_session_id', session.id);
    
    console.log('✅ Paiement marqué comme succeeded');
  } catch (error) {
    console.error('❌ Erreur mise à jour paiement:', error);
  }
  
  // ... reste du code (boost de l'annonce)
  break;

// AJOUTER aussi les cas d'échec :

case 'payment_intent.payment_failed':
  const failedIntent = event.data.object as Stripe.PaymentIntent;
  
  await supabaseAdmin
    .from('stripe_payments')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', failedIntent.id);
  
  console.log('❌ Paiement échoué:', failedIntent.id);
  break;

case 'payment_intent.canceled':
  const canceledIntent = event.data.object as Stripe.PaymentIntent;
  
  await supabaseAdmin
    .from('stripe_payments')
    .update({ status: 'canceled' })
    .eq('stripe_payment_intent_id', canceledIntent.id);
  
  console.log('🚫 Paiement annulé:', canceledIntent.id);
  break;
```

### 🚀 Redéploiement

Une fois les modifications faites :

```bash
# Redéployer les Edge Functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### ✅ Avantages

Après cette mise à jour :
- ✅ Tous les paiements sont trackés en base de données
- ✅ Les stats de revenus s'affichent en temps réel
- ✅ L'historique complet est conservé
- ✅ Fonctionne en mode test ET production

### 📊 Résultat dans le Dashboard

Le graphique "Revenus boosts" affichera les vrais montants collectés au lieu de zéros !
