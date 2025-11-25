# Templates d'emails Appyna

Ce dossier contient les templates HTML pour les emails automatiques envoyés par Supabase.

## 📧 Templates disponibles

### 1. **confirm-signup.html** - Email de confirmation d'inscription
- Envoyé lors de la création d'un nouveau compte
- Contient le lien de confirmation d'email
- Expire après 24 heures

### 2. **reset-password.html** - Email de réinitialisation de mot de passe
- Envoyé lors d'une demande de mot de passe oublié
- Contient le lien de réinitialisation
- Expire après 1 heure

## 🎨 Design

Les templates utilisent les couleurs officielles d'Appyna :
- **Violet principal** : `#9333ea` (primary-600)
- **Teal secondaire** : `#14b8a6` (secondary-500)
- **Dégradé** : Gradient du violet vers le teal

## 📝 Configuration dans Supabase

### Étape 1 : Accéder aux templates
1. Connecte-toi sur https://supabase.com/dashboard
2. Sélectionne ton projet : `nbtdowycvyogjopcidjq`
3. Va dans **Authentication** → **Email Templates**

### Étape 2 : Template "Confirm signup"
1. Clique sur **"Confirm signup"**
2. **Subject** : Colle ceci
   ```
   Bienvenue sur Appyna - Confirmez votre email
   ```
3. **Body** : Ouvre `confirm-signup.html` et colle tout le contenu
4. Clique sur **Save**

### Étape 3 : Template "Reset password"
1. Clique sur **"Reset password"**
2. **Subject** : Colle ceci
   ```
   Réinitialisation de votre mot de passe Appyna
   ```
3. **Body** : Ouvre `reset-password.html` et colle tout le contenu
4. Clique sur **Save**

## 🔗 Variables Supabase

Les templates utilisent ces variables automatiques :
- `{{ .ConfirmationURL }}` - Lien de confirmation/réinitialisation (obligatoire)
- `{{ .Email }}` - Adresse email de l'utilisateur
- `{{ .SiteURL }}` - URL de ton site (configuré dans Supabase)

## ✅ Test des emails

Pour tester :
1. Inscris un nouveau compte sur https://appyna.com/signup
2. Vérifie ta boîte email (et les spams)
3. L'email doit avoir le design Appyna avec les dégradés violet-teal

## 🎯 Fonctionnalités des templates

### Email de confirmation
- ✅ Design professionnel avec dégradé Appyna
- ✅ Bouton CTA principal
- ✅ Lien alternatif en texte brut
- ✅ Information sur l'expiration (24h)
- ✅ Message de sécurité si email non sollicité
- ✅ Footer avec informations légales

### Email de réinitialisation
- ✅ Icône de sécurité
- ✅ Bouton CTA principal
- ✅ Lien alternatif en texte brut
- ✅ Alerte de sécurité (expiration 1h)
- ✅ Conseils pour un mot de passe fort
- ✅ Message si demande non sollicitée
- ✅ Footer avec avertissement de sécurité

## 📱 Responsive

Les templates sont optimisés pour :
- ✅ Desktop
- ✅ Mobile
- ✅ Clients email (Gmail, Outlook, Apple Mail, etc.)

## 🔒 Sécurité

- Les liens expirent automatiquement (géré par Supabase)
- Messages de sécurité inclus dans les emails
- Avertissements en cas de demande non sollicitée

---

**Note** : Ces templates utilisent du HTML inline CSS pour une compatibilité maximale avec tous les clients email.
