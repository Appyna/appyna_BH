# 🚀 Déploiement des Edge Functions avec tracking Stripe

## 📋 Étapes à suivre

### 1️⃣ Mettre à jour `create-checkout-session`

1. Allez sur **Supabase Dashboard** : https://supabase.com/dashboard/project/nbtdowycvyogjopcidjq
2. Menu **Edge Functions** → Cliquez sur `create-checkout-session`
3. Cliquez sur **"Edit function"** ou **"Update"**
4. **Remplacez tout le code** par le contenu de `/edge-functions/create-checkout-session.ts`
5. Cliquez sur **"Deploy"**

**Ce qui a changé** :
- ✅ Après création de la session Stripe, on insère un enregistrement dans `stripe_payments` avec `status = 'pending'`
- ✅ Enregistrement du `session.id`, `user_id`, `listing_id`, `amount`, et `boost_days`

---

### 2️⃣ Mettre à jour `stripe-webhook`

1. Menu **Edge Functions** → Cliquez sur `stripe-webhook`
2. Cliquez sur **"Edit function"** ou **"Update"**
3. **Remplacez tout le code** par le contenu de `/edge-functions/stripe-webhook.ts`
4. Cliquez sur **"Deploy"**

**Ce qui a changé** :
- ✅ Sur `checkout.session.completed` → Met à jour le paiement à `status = 'succeeded'`
- ✅ Sur `payment_intent.payment_failed` → Met à jour à `status = 'failed'`
- ✅ Sur `payment_intent.canceled` → Met à jour à `status = 'canceled'`

---

### 3️⃣ Configurer les événements Webhook (si pas déjà fait)

1. Allez sur **Stripe Dashboard** : https://dashboard.stripe.com/test/webhooks
2. Cliquez sur votre webhook existant (ou créez-en un si absent)
3. Vérifiez que ces événements sont activés :
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.payment_failed`
   - ✅ `payment_intent.canceled`
4. URL du webhook : `https://nbtdowycvyogjopcidjq.supabase.co/functions/v1/stripe-webhook`

---

## ✅ Test complet

### Étape 1 : Créer un boost test

1. Connectez-vous à votre app en tant qu'utilisateur normal
2. Allez sur une de vos annonces
3. Cliquez sur "Booster cette annonce"
4. Choisissez une durée (1, 3 ou 7 jours)
5. Cliquez sur "Payer avec Stripe"

### Étape 2 : Vérifier la création du paiement

1. Allez dans **Supabase** → Table Editor → `stripe_payments`
2. Vous devriez voir un nouvel enregistrement avec :
   - `status = 'pending'`
   - `stripe_session_id` rempli
   - `user_id` et `listing_id` corrects
   - `amount` = 9.90, 24.90 ou 39.90 (selon la durée)

### Étape 3 : Compléter le paiement

1. Dans Stripe Checkout, utilisez la carte test : `4242 4242 4242 4242`
2. Date d'expiration : n'importe quelle date future (ex: 12/34)
3. CVC : n'importe quel code 3 chiffres (ex: 123)
4. Cliquez sur "Payer"

### Étape 4 : Vérifier le webhook

1. Retournez dans **Supabase** → Table `stripe_payments`
2. Rafraîchissez la table
3. Le même enregistrement devrait maintenant avoir :
   - `status = 'succeeded'`
   - `stripe_payment_intent_id` rempli
   - `updated_at` mis à jour

### Étape 5 : Vérifier le dashboard admin

1. Connectez-vous avec un compte admin (projet.lgsz@gmail.com)
2. Allez sur `/admin/dashboard`
3. Vérifiez que :
   - **Revenus générés** affiche le montant (ex: 39.90 ILS)
   - Le graphique **Revenus des 30 derniers jours** montre le paiement
   - **Boosts actifs** a augmenté de 1
   - **Total boosts** a augmenté de 1

---

## 🔍 Debug

### Si le paiement reste en 'pending'

1. Vérifiez les logs du webhook dans **Supabase** → Edge Functions → `stripe-webhook` → Logs
2. Vérifiez les logs dans **Stripe** → Developers → Webhooks → Votre endpoint → Events
3. Assurez-vous que `STRIPE_WEBHOOK_SECRET` est bien configuré dans Supabase

### Si aucun paiement n'apparaît dans la table

1. Vérifiez les logs de `create-checkout-session` dans Supabase
2. Vérifiez que la table `stripe_payments` existe bien
3. Vérifiez les RLS policies (les admins et le system doivent pouvoir insérer)

---

## 📊 Résultat attendu

Après un paiement test réussi, vous devriez voir dans le dashboard admin :

```
💰 Revenus générés
39.90 ILS
```

Et dans le graphique "Revenus des 30 derniers jours", une barre pour la date du jour avec le montant.

**Le système est maintenant complètement opérationnel** pour tracker tous vos revenus Stripe ! 🎉

---

## 🎯 Prochaine étape

Une fois le tracking Stripe validé, nous pourrons passer à la prochaine fonctionnalité :
- **Système de formulaires de contact**
- SEO
- Analytics
- etc.
