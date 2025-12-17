# 🚨 PLAN D'ACTION IMMÉDIAT - CORRECTIONS BLOQUANTES
## À appliquer AVANT le lancement public

**Date:** 16 décembre 2025  
**Durée estimée:** 4-6 heures de travail  
**Priorité:** ⛔ CRITIQUE

---

## ✅ ÉTAPE 1: Sécuriser les variables d'environnement (30 min)

### Action 1.1: Créer les fichiers .env

```bash
# 1. Créer .env à la racine
cat > .env << 'EOF'
# Supabase
VITE_SUPABASE_URL=https://nbtdowycvyogjopcidjq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=drcq4uwd0
VITE_CLOUDINARY_UPLOAD_PRESET=appyna_unsigned

# Gemini (si utilisé)
GEMINI_API_KEY=your_gemini_key_here
EOF

# 2. Créer .env.example (documentation)
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

# Optional: Gemini AI
GEMINI_API_KEY=
EOF

# 3. Ajouter à .gitignore
cat >> .gitignore << 'EOF'

# Environment variables
.env
.env.local
.env.production
.env.development
EOF
```

### Action 1.2: Modifier vite.config.ts

```typescript
// vite.config.ts - AVANT
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      // ...
    };
});

// APRÈS - Supprimer les defines, Vite gère automatiquement les VITE_*
export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

### Action 1.3: Mettre à jour les fichiers utilisant Cloudinary

```typescript
// lib/uploadService.ts - AVANT
const CLOUDINARY_CLOUD_NAME = 'drcq4uwd0';
const CLOUDINARY_UPLOAD_PRESET = 'appyna_unsigned';

// APRÈS
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error('Missing Cloudinary environment variables');
}
```

### Action 1.4: Configurer Vercel

```bash
# Sur Vercel Dashboard > Settings > Environment Variables
# Ajouter toutes les variables VITE_* depuis votre .env
```

---

## ✅ ÉTAPE 2: Ajouter les headers de sécurité (15 min)

### Remplacer vercel.json

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://api.stripe.com https://www.google-analytics.com; frame-src 'self' https://js.stripe.com;"
        }
      ]
    },
    {
      "source": "/.well-known/(.*)",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/json"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ ÉTAPE 3: Remplacer console.log par logger (45 min)

### Action 3.1: Créer lib/logger.ts

```typescript
// lib/logger.ts
type LogLevel = 'log' | 'warn' | 'error' | 'info';

interface Logger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

const isDev = import.meta.env.DEV;

export const logger: Logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  
  error: (...args: any[]) => {
    // Les erreurs sont toujours loggées
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  }
};
```

### Action 3.2: Remplacer dans tous les fichiers

```bash
# Utiliser Find & Replace dans VS Code
# Chercher: console\.log\(
# Remplacer: logger.log(

# Fichiers à modifier:
# - App.tsx
# - pages/CreateListingPage.tsx
# - pages/HomePage.tsx
# - pages/AdminModerationPage.tsx
# - edge-functions/stripe-webhook.ts (garder console.log ici, c'est Deno)
# - lib/listingsService.ts
# - lib/messagesService.ts
```

**Important:** Dans les edge functions (Deno), garder `console.log` car c'est leur système de logging.

---

## ✅ ÉTAPE 4: Ajouter les contraintes SQL (30 min)

### Se connecter à Supabase SQL Editor

```sql
-- ================================================
-- SCRIPT DE SÉCURISATION - CONTRAINTES SQL
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ================================================

-- 1. Contraintes sur la table listings
ALTER TABLE listings
  ADD CONSTRAINT IF NOT EXISTS listings_title_length 
    CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 80),
  ADD CONSTRAINT IF NOT EXISTS listings_description_length 
    CHECK (LENGTH(description) >= 10 AND LENGTH(description) <= 5000),
  ADD CONSTRAINT IF NOT EXISTS listings_price_valid 
    CHECK (price >= 0 AND price <= 1000000),
  ADD CONSTRAINT IF NOT EXISTS listings_images_max 
    CHECK (array_length(images, 1) <= 6 OR images IS NULL);

-- 2. Contraintes sur la table users
ALTER TABLE users
  ADD CONSTRAINT IF NOT EXISTS users_name_length 
    CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100),
  ADD CONSTRAINT IF NOT EXISTS users_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT IF NOT EXISTS users_phone_format 
    CHECK (phone IS NULL OR phone ~* '^\+?[0-9]{9,15}$');

-- 3. Contraintes sur la table messages
ALTER TABLE messages
  ADD CONSTRAINT IF NOT EXISTS messages_text_length 
    CHECK (LENGTH(text) >= 1 AND LENGTH(text) <= 5000);

-- 4. Contraintes sur la table reports
ALTER TABLE reports
  ADD CONSTRAINT IF NOT EXISTS reports_description_length 
    CHECK (description IS NULL OR LENGTH(description) <= 1000);

-- 5. Vérifier les contraintes
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE contype = 'c'
AND connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, conname;
```

---

## ✅ ÉTAPE 5: Implémenter Rate Limiting côté serveur (60 min)

### Action 5.1: Créer la table rate_limits

```sql
-- Créer table rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, action)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_window 
ON rate_limits(user_id, action, window_start);

-- Activer RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: users peuvent voir leurs propres limites
CREATE POLICY "Users can view own rate limits"
  ON rate_limits FOR SELECT
  USING (auth.uid() = user_id);
```

### Action 5.2: Créer la fonction de vérification

```sql
-- Fonction pour vérifier et incrémenter
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_action TEXT,
  p_max_requests INT,
  p_window_minutes INT
) RETURNS BOOLEAN AS $$
DECLARE
  current_count INT;
  current_window TIMESTAMPTZ;
BEGIN
  -- Récupérer le count actuel
  SELECT count, window_start INTO current_count, current_window
  FROM rate_limits
  WHERE user_id = p_user_id AND action = p_action
  FOR UPDATE; -- Lock pour éviter race conditions
  
  -- Si pas d'entrée, créer
  IF NOT FOUND THEN
    INSERT INTO rate_limits (user_id, action, count, window_start)
    VALUES (p_user_id, p_action, 1, NOW());
    RETURN TRUE;
  END IF;
  
  -- Si fenêtre expirée, reset
  IF current_window < NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
    UPDATE rate_limits 
    SET count = 1, window_start = NOW()
    WHERE user_id = p_user_id AND action = p_action;
    RETURN TRUE;
  END IF;
  
  -- Si limite atteinte
  IF current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;
  
  -- Incrémenter
  UPDATE rate_limits 
  SET count = count + 1
  WHERE user_id = p_user_id AND action = p_action;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute
GRANT EXECUTE ON FUNCTION check_rate_limit(UUID, TEXT, INT, INT) TO authenticated;
```

### Action 5.3: Créer RPC wrapper sécurisé

```sql
-- Wrapper pour appeler depuis le client
CREATE OR REPLACE FUNCTION can_create_listing()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN check_rate_limit(
    auth.uid(),
    'create_listing',
    15, -- max 15 annonces
    1440 -- par jour (24h)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION can_send_message()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN check_rate_limit(
    auth.uid(),
    'send_message',
    50, -- max 50 messages
    60  -- par heure
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION can_create_report()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN check_rate_limit(
    auth.uid(),
    'create_report',
    10, -- max 10 signalements
    1440 -- par jour
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### Action 5.4: Utiliser côté client

```typescript
// lib/listingsService.ts - Modifier createListing
async createListing(listing: {...}): Promise<Listing | null> {
  // 1. Vérifier rate limit
  const { data: canCreate } = await supabase.rpc('can_create_listing');
  
  if (!canCreate) {
    throw new Error('Limite atteinte: vous ne pouvez créer que 15 annonces par jour.');
  }
  
  // 2. Créer l'annonce
  const { data, error } = await supabase
    .from('listings')
    .insert([{...}])
    .select()
    .single();
  
  // ... reste du code
}

// lib/messagesService.ts - Modifier sendMessage
async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message | null> {
  // 1. Vérifier rate limit
  const { data: canSend } = await supabase.rpc('can_send_message');
  
  if (!canSend) {
    throw new Error('Limite atteinte: vous ne pouvez envoyer que 50 messages par heure.');
  }
  
  // 2. Envoyer le message
  // ... reste du code
}

// lib/reportsService.ts - Modifier createReport
async createReport(report: {...}): Promise<boolean> {
  // 1. Vérifier rate limit
  const { data: canReport } = await supabase.rpc('can_create_report');
  
  if (!canReport) {
    throw new Error('Limite atteinte: vous ne pouvez créer que 10 signalements par jour.');
  }
  
  // 2. Créer le signalement
  // ... reste du code
}
```

---

## ✅ ÉTAPE 6: Ajouter policies pour stripe_payments (10 min)

```sql
-- Policies manquantes pour stripe_payments
CREATE POLICY "Users can view own payments"
  ON stripe_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON stripe_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- Vérifier que RLS est activé
ALTER TABLE stripe_payments ENABLE ROW LEVEL SECURITY;
```

---

## ✅ ÉTAPE 7: Valider les uploads d'images (20 min)

```typescript
// lib/uploadService.ts - Ajouter avant compressImage

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function validateImage(file: File): Promise<void> {
  // 1. Vérifier le type MIME
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Type de fichier non autorisé: ${file.type}. ` +
      `Seuls les formats JPEG, PNG et WebP sont acceptés.`
    );
  }
  
  // 2. Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} MB). ` +
      `Taille maximum: 10 MB.`
    );
  }
  
  // 3. Vérifier les magic bytes (signature du fichier)
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47
  // WebP: 52 49 46 46 (RIFF) + 57 45 42 50 (WEBP) à l'offset 8
  const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  const isWebP = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
                 bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  
  if (!isJPEG && !isPNG && !isWebP) {
    throw new Error(
      'Le fichier ne correspond pas à un format d\'image valide ' +
      '(vérification des signatures).'
    );
  }
}

// Modifier uploadImage pour utiliser la validation
export async function uploadImage(file: File, folder?: string): Promise<string> {
  // Validation AVANT compression
  await validateImage(file);
  
  // Compresser l'image
  const compressedFile = await compressImage(file);
  
  // ... reste du code
}
```

---

## ✅ ÉTAPE 8: Optimiser Sentry (5 min)

```typescript
// index.tsx - Modifier la config Sentry
Sentry.init({
  dsn: "https://2dd6688c6c19a433f277cdef668cb780@o4510427503329280.ingest.de.sentry.io/4510427513421904",
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true, // ✅ Changer false → true pour privacy
      blockAllMedia: true, // ✅ Changer false → true
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // ✅ 10% en prod
  // Session Replay
  replaysSessionSampleRate: 0.05, // ✅ Réduire à 5%
  replaysOnErrorSampleRate: 1.0,
  enabled: import.meta.env.MODE === 'production',
  
  // ✅ Ajouter ces options
  beforeSend(event, hint) {
    // Ne pas envoyer les erreurs de dev tools
    if (event.exception?.values?.[0]?.value?.includes('Extension context invalidated')) {
      return null;
    }
    return event;
  },
});
```

---

## ✅ ÉTAPE 9: Tests avant mise en prod (30 min)

### Checklist de tests manuels

```bash
# 1. Tester les variables d'environnement
npm run build
# Vérifier qu'aucune clé API n'apparaît dans dist/assets/*.js

# 2. Tester l'authentification
- [ ] Inscription avec email invalide → Erreur
- [ ] Inscription avec mot de passe court → Erreur
- [ ] Connexion avec mauvais mot de passe → Erreur
- [ ] Email de confirmation reçu
- [ ] Connexion après confirmation → Succès

# 3. Tester les contraintes SQL
- [ ] Créer annonce avec titre de 2 caractères → Erreur
- [ ] Créer annonce avec prix négatif → Erreur
- [ ] Créer annonce avec 7 images → Erreur

# 4. Tester le rate limiting
- [ ] Créer 16 annonces en 1 jour → 16ème bloquée
- [ ] Envoyer 51 messages en 1h → 51ème bloqué
- [ ] Créer 11 signalements en 1 jour → 11ème bloqué

# 5. Tester la validation d'images
- [ ] Upload d'un fichier .exe renommé en .jpg → Erreur
- [ ] Upload d'un fichier > 10MB → Erreur
- [ ] Upload d'un vrai JPEG → Succès

# 6. Tester la sécurité
- [ ] Accéder à /admin/dashboard sans être admin → Redirection
- [ ] Voir les messages d'un autre utilisateur → Aucun message
- [ ] Modifier l'annonce d'un autre → Erreur RLS

# 7. Tester les headers de sécurité
curl -I https://appyna.com
# Vérifier présence de:
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Strict-Transport-Security
```

---

## ✅ ÉTAPE 10: Déploiement (10 min)

### Procédure de déploiement sécurisée

```bash
# 1. Commit des changements
git add .
git commit -m "🔒 Security: Add env variables, headers, rate limiting, validation"

# 2. Push vers GitHub (trigger auto-deploy Vercel)
git push origin main

# 3. Vérifier les variables d'env sur Vercel
# Dashboard > Settings > Environment Variables
# S'assurer que toutes les VITE_* sont présentes

# 4. Vérifier le build sur Vercel
# Dashboard > Deployments > Latest
# Attendre "Ready" (2-3 min)

# 5. Tester en production
curl -I https://appyna.com
# Vérifier headers de sécurité

# 6. Tester une fonctionnalité critique
# - Créer une annonce
# - Envoyer un message
# - Se connecter/déconnecter

# 7. Monitorer Sentry pendant 1h
# https://sentry.io/organizations/.../issues/
# Vérifier absence d'erreurs critiques
```

---

## 📊 RÉSUMÉ DU TEMPS ESTIMÉ

| Étape | Temps | Critique |
|-------|-------|----------|
| 1. Variables d'env | 30 min | ⛔ OUI |
| 2. Headers sécurité | 15 min | ⛔ OUI |
| 3. Logger | 45 min | ⚠️ Important |
| 4. Contraintes SQL | 30 min | ⛔ OUI |
| 5. Rate limiting | 60 min | ⛔ OUI |
| 6. Policies Stripe | 10 min | ⛔ OUI |
| 7. Validation images | 20 min | ⛔ OUI |
| 8. Optimiser Sentry | 5 min | 🟡 Recommandé |
| 9. Tests | 30 min | ⛔ OUI |
| 10. Déploiement | 10 min | - |
| **TOTAL** | **4h 15min** | |

---

## 🎯 ORDRE DE PRIORITÉ

Si vous manquez de temps, traiter dans cet ordre:

1. ⛔ **CRITIQUE (1h30):**
   - Étape 1: Variables d'env (30min)
   - Étape 2: Headers (15min)
   - Étape 4: Contraintes SQL (30min)
   - Étape 6: Policies Stripe (10min)
   - Étape 9: Tests basiques (5min)

2. ⚠️ **IMPORTANT (2h):**
   - Étape 5: Rate limiting (60min)
   - Étape 7: Validation images (20min)
   - Étape 3: Logger (45min)

3. 🟡 **RECOMMANDÉ (15min):**
   - Étape 8: Sentry (5min)
   - Étape 9: Tests complets (10min)

---

## ❓ AIDE ET SUPPORT

### En cas de problème:

1. **Vérifier les logs Vercel:**
   ```bash
   vercel logs --follow
   ```

2. **Vérifier les logs Supabase:**
   - Dashboard > Logs > Postgres Logs
   - Chercher les erreurs RLS

3. **Rollback d'urgence:**
   ```bash
   # Sur Vercel Dashboard > Deployments
   # Cliquer sur le dernier déploiement stable
   # Bouton "Promote to Production"
   ```

### Contacts:

- **Support Supabase:** support@supabase.io
- **Support Vercel:** support@vercel.com
- **Documentation:** https://supabase.com/docs

---

**DERNIÈRE RÉVISION:** 16 décembre 2025  
**VALIDITÉ:** Ce plan doit être exécuté dans les 48h pour maintenir la sécurité
