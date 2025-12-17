# 🚀 INSTRUCTIONS DE DÉPLOIEMENT - FIX TRI ANNONCES

## ⚠️ ÉTAPE CRITIQUE : Migration SQL à exécuter

**Le code a été déployé mais la migration SQL DOIT être exécutée pour que ça fonctionne !**

---

## 📋 ÉTAPES À SUIVRE (5 minutes)

### **1. Ouvrir Supabase**
→ https://supabase.com/dashboard
→ Sélectionnez votre projet **Appyna**

### **2. Aller dans SQL Editor**
→ Cliquez sur "SQL Editor" dans le menu de gauche
→ Cliquez sur "New query"

### **3. Copier-coller le SQL**
→ Ouvrez le fichier `supabase-fix-listings-sort-order.sql`
→ Copiez TOUT le contenu
→ Collez dans l'éditeur Supabase

### **4. Exécuter**
→ Cliquez sur "Run" (ou Ctrl+Enter)
→ Vous devriez voir : ✅ "Success. No rows returned"

### **5. Vérifier**
→ La dernière requête SELECT du script affiche les 10 premières annonces
→ Vous devriez voir la colonne `status` avec :
   - "Boosté actif" pour les annonces boostées
   - "Non boosté" pour les autres
   - Ordre correct : boostées actives d'abord, puis chronologique

---

## 🎯 CE QUE FAIT LA MIGRATION

1. **Ajoute une colonne `is_boost_active`** (calculée automatiquement)
   - `TRUE` si l'annonce est boostée ET que `boosted_until > NOW()`
   - `FALSE` sinon

2. **Crée un index optimisé** pour le tri rapide

3. **Affiche un aperçu** des 10 premières annonces dans le bon ordre

---

## ✅ VÉRIFICATION FINALE

Après avoir exécuté la migration :

1. **Attendez 2-3 minutes** que Vercel finisse de déployer
2. **Rafraîchissez votre site** (Ctrl+F5 / Cmd+Shift+R)
3. **Vérifiez l'ordre** sur la page d'accueil :
   - Les annonces boostées doivent être EN HAUT
   - Les plus récemment boostées en premier
   - Puis les annonces normales par ordre chronologique

4. **Scrollez** pour charger plus d'annonces
   - ✅ Plus de doublons
   - ✅ Ordre stable

---

## 🚨 EN CAS DE PROBLÈME

Si vous voyez une erreur lors de l'exécution SQL :

**Erreur : "column is_boost_active already exists"**
→ Normal si vous aviez déjà tenté. Supprimez ces lignes du script :
```sql
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS is_boost_active...
```
Et réexécutez juste l'INDEX et la requête SELECT.

**Autre erreur**
→ Contactez-moi avec le message d'erreur exact

---

## 📊 RÉSULTAT ATTENDU

**AVANT (bugué) :**
```
Page 1-50 : Boost de 3 mois, annonce normale...
Scroll...
Page 51-100 : Boost de 2h (devrait être page 1), annonces...
→ DOUBLONS + ORDRE CASSÉ
```

**APRÈS (corrigé) :**
```
Boost de 2h (le plus récent) ← Position 1
Boost de 3 mois             ← Position 2
Annonce de 5 min            ← Position 3
Annonce de 2h               ← Position 4
...
Scroll → Pas de doublons, ordre maintenu ✅
```

---

## ⏱️ TIMELINE

- ✅ Code déployé sur Vercel (auto, en cours)
- ⚠️ **VOUS DEVEZ** : Exécuter la migration SQL (5 min)
- ✅ Site fonctionnel avec tri correct

**Action maintenant : Exécutez le SQL dans Supabase !**
