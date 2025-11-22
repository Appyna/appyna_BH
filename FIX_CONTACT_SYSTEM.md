# 🔧 Fix pour le système de contact - Migration de la base de données

## ❌ Problèmes identifiés

La base de données actuelle a une structure incompatible avec le système de contact :

1. **`listing_id` obligatoire** : La table `conversations` exige un `listing_id`, mais les conversations de support n'ont pas d'annonce associée
2. **Colonnes incorrectes** : Le code utilisait des noms de colonnes qui n'existent pas :
   - `participant1_id` / `participant2_id` → devrait être `user1_id` / `user2_id`
   - `last_message_at` → devrait être `updated_at`
   - `content` dans messages → devrait être `text`
   - `is_read` n'existe pas dans la table messages

## ✅ Corrections apportées

### 1. Fichiers code mis à jour

- **`components/ContactModal.tsx`** : 
  - Utilise maintenant `user1_id` et `user2_id`
  - Cherche les conversations existantes correctement
  - Insère `listing_id: null` pour les conversations de support
  - Utilise `text` au lieu de `content` pour les messages
  - Génère un UUID automatique au lieu de concaténer les IDs

- **`pages/AdminSupportPage.tsx`** :
  - Corrigé `participant1_id` → `user1_id`
  - Corrigé `participant2_id` → `user2_id`
  - Corrigé `last_message_at` → `updated_at`
  - Corrigé `content` → `text`
  - Supprimé la fonctionnalité `is_read` qui n'existe pas

### 2. Migration SQL créée

Un fichier `supabase-support-migration.sql` a été créé avec les modifications suivantes :

```sql
-- Rend listing_id nullable pour permettre les conversations de support
ALTER TABLE conversations 
ALTER COLUMN listing_id DROP NOT NULL;

-- Met à jour les index uniques pour gérer les deux types de conversations :
-- 1. Conversations avec annonce (listing_id + user1 + user2)
-- 2. Conversations de support (user1 + user2 seulement)
```

## 🚀 Comment appliquer la migration

### Option A : Via l'interface Supabase (RECOMMANDÉ)

1. Allez sur [Supabase Dashboard](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** dans le menu latéral
4. Créez une nouvelle query
5. Copiez-collez le contenu complet de `supabase-support-migration.sql`
6. Cliquez sur **Run** (ou Ctrl+Enter)
7. Vérifiez qu'il n'y a pas d'erreurs

### Option B : Via psql en ligne de commande

Si vous avez PostgreSQL installé localement :

```bash
PGPASSWORD='Liamappyna2025!' psql \
  "postgresql://postgres.nbtdowycvyogjopcidjq@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" \
  -f supabase-support-migration.sql
```

## 🧪 Test après migration

Une fois la migration appliquée :

1. **Démarrez le serveur de dev** (si pas déjà lancé) :
   ```bash
   npm run dev
   ```

2. **Testez le formulaire de contact** :
   - Connectez-vous avec un compte utilisateur (pas l'admin)
   - Cliquez sur "Contacter l'équipe Appyna" dans le menu
   - Remplissez le formulaire et envoyez
   - Vous devriez être redirigé vers `/messages` avec la conversation créée

3. **Testez l'interface admin** :
   - Connectez-vous avec le compte admin (`projet.lgsz@gmail.com`)
   - Allez dans Dashboard Admin > Support Client
   - Vous devriez voir la conversation de test
   - Répondez au message

4. **Vérifiez la réception** :
   - Retournez sur le compte utilisateur
   - Allez dans Messages
   - Vous devriez voir la réponse de "Appyna®"

## 📊 Vérification de la structure

Après migration, la table `conversations` devrait avoir :

```
id              UUID PRIMARY KEY
listing_id      UUID (NULLABLE)  ← Changé de NOT NULL à NULL
user1_id        UUID NOT NULL
user2_id        UUID NOT NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🐛 En cas de problème

Si vous voyez encore des erreurs :

1. **Vérifiez que la migration s'est bien exécutée** :
   ```sql
   SELECT column_name, is_nullable, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'conversations';
   ```

2. **Vérifiez les index** :
   ```sql
   SELECT indexname, indexdef 
   FROM pg_indexes 
   WHERE tablename = 'conversations';
   ```

3. **Testez l'insertion manuelle** :
   ```sql
   INSERT INTO conversations (user1_id, user2_id, listing_id)
   VALUES (
     '0425895a-a975-4d8c-9aae-c78886834e86',
     '91c84b9e-376e-45c1-84f7-329476e9e5eb',
     NULL
   );
   ```

Si cela fonctionne, la migration est correcte et le problème vient du code.

## 📝 Résumé des changements

- ✅ Code corrigé pour utiliser les bons noms de colonnes
- ✅ Migration SQL créée pour rendre `listing_id` nullable
- ✅ Index mis à jour pour supporter les deux types de conversations
- ✅ Suppression des références aux colonnes inexistantes (`is_read`)
- ⏳ Migration à appliquer manuellement via Supabase Dashboard

**Prochaine étape** : Appliquer la migration SQL via Supabase Dashboard, puis tester le formulaire de contact.
