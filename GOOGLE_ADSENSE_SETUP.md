# Configuration Google AdSense/AdMob pour Appyna

## 📋 Guide de configuration

### 1. Créer un compte Google AdSense

1. Allez sur [Google AdSense](https://www.google.com/adsense)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Commencer"
4. Remplissez les informations de votre site : **appyna.com**
5. Acceptez les conditions d'utilisation

### 2. Obtenir votre Publisher ID

Une fois votre compte créé, vous recevrez un **Publisher ID** au format :
```
ca-pub-XXXXXXXXXXXXXXXX
```

**📍 Où le trouver :**
- Tableau de bord AdSense > Compte > Paramètres du compte
- Il commence toujours par `ca-pub-`

### 3. Configurer les emplacements publicitaires

#### Créer des blocs d'annonces dans AdSense

1. Dans AdSense, allez dans **Annonces** > **Par unité publicitaire**
2. Créez les blocs suivants :

**🖥️ Desktop :**
- **HomePage Desktop Banner** : Format Display 728x90 ou responsive
- **ListingDetail Sidebar Square** : Format Display 300x250

**📱 Mobile :**
- **HomePage Mobile Banner** : Format Display 320x50 ou responsive
- **ListingDetail Mobile Bottom** : Format Display 320x50 ou responsive

3. Pour chaque bloc créé, notez le **Slot ID** (format numérique : `1234567890`)

### 4. Intégrer les identifiants dans le code

#### A. Fichier `index.html` (ligne 18)

Remplacez `XXXXXXXXXXXXXXXX` par votre Publisher ID :

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE_PUBLISHER_ID"
 crossorigin="anonymous"></script>
```

**Exemple :**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
 crossorigin="anonymous"></script>
```

#### B. Fichier `components/AdBanner.tsx` (ligne 59)

Remplacez `XXXXXXXXXXXXXXXX` par votre Publisher ID :

```tsx
data-ad-client="ca-pub-VOTRE_PUBLISHER_ID"
```

**Exemple :**
```tsx
data-ad-client="ca-pub-1234567890123456"
```

#### C. Configurer les Slot IDs dans les pages

**HomePage.tsx** - Remplacez les slot IDs :
```tsx
// Ligne 358 - Mobile
adSlot={`mobile-slot-${Math.floor((index + 1) / 5)}`}
// Devient :
adSlot="1234567890" // Votre Slot ID HomePage Mobile

// Ligne 367 - Desktop
adSlot={`desktop-slot-${Math.floor((index + 1) / 6)}`}
// Devient :
adSlot="0987654321" // Votre Slot ID HomePage Desktop
```

**ListingDetailPage.tsx** - Remplacez les slot IDs :
```tsx
// Ligne 556 - Sidebar Square Desktop
adSlot="sidebar-square"
// Devient :
adSlot="1122334455" // Votre Slot ID Sidebar

// Ligne 566 - Mobile Bottom
adSlot="mobile-bottom"
// Devient :
adSlot="5544332211" // Votre Slot ID Mobile Bottom
```

### 5. Vérification du code AdSense

Google doit valider que le code est bien installé sur votre site :

1. Retournez dans AdSense > **Sites**
2. Cliquez sur votre site **appyna.com**
3. Google vérifie automatiquement la présence du code (peut prendre 24-48h)
4. Vous recevrez un email quand votre site est validé

### 6. Emplacements des publicités sur votre site

#### 🏠 Page d'accueil (HomePage)

**Desktop :**
- Bannière horizontale (728x90) apparaît **toutes les 2 rangées** (6 annonces)
- Largeur complète entre les listings

**Mobile :**
- Bannière horizontale (320x50) apparaît **toutes les 5 annonces**
- Centre, entre les annonces

#### 📄 Page détail annonce (ListingDetailPage)

**Desktop :**
- Carré (300x250) dans la **sidebar à droite**
- En dessous du carré "Gérer mon annonce" (votre annonce)
- En dessous du carré "Fiche contact" (annonce d'un autre user)

**Mobile :**
- Bannière horizontale (320x50) **en bas de la page**
- Après tout le contenu
- En dessous du carré "Gérer mon annonce" ou "Contact"

### 7. Mode développement

Le composant `AdBanner` affiche un **placeholder gris** en mode développement :
- Bordure pointillée
- Texte "Publicité Google"
- Format indiqué

Les vraies pubs apparaîtront uniquement en **production** (sur appyna.com).

### 8. Validation et activation

Une fois que :
1. ✅ Votre code est intégré
2. ✅ Google a vérifié votre site (24-48h)
3. ✅ Votre compte est approuvé

Les publicités commenceront à s'afficher automatiquement !

### 9. Suivi des revenus

- Tableau de bord AdSense > **Rapports**
- Voir les revenus par jour, page, format
- Optimiser les emplacements selon les performances

## 🎯 Résumé des modifications

### Fichiers créés :
- ✅ `components/AdBanner.tsx` - Composant réutilisable

### Fichiers modifiés :
- ✅ `index.html` - Script AdSense ajouté
- ✅ `pages/HomePage.tsx` - Pubs toutes les 2 rangées (desktop) / 5 annonces (mobile)
- ✅ `pages/ListingDetailPage.tsx` - Pub sidebar (desktop) / bas de page (mobile)

## ⚠️ Important

### À faire AVANT de déployer :

1. **Remplacer** dans `index.html` :
   ```
   ca-pub-XXXXXXXXXXXXXXXX → Votre Publisher ID
   ```

2. **Remplacer** dans `components/AdBanner.tsx` :
   ```
   ca-pub-XXXXXXXXXXXXXXXX → Votre Publisher ID
   ```

3. **Remplacer les Slot IDs** dans `HomePage.tsx` et `ListingDetailPage.tsx`

### Notes sur les revenus :

- **Coût par clic (CPC)** : Dépend de votre niche et localisation
- **Israël** : CPC généralement élevé (marché tech)
- **Format recommandé** : Responsive pour s'adapter à tous les écrans
- **Optimisation** : Testez différents formats après quelques semaines

## 📞 Support

Si vous avez des questions sur AdSense :
- [Centre d'aide AdSense](https://support.google.com/adsense)
- [Forum communautaire](https://support.google.com/adsense/community)

---

**🚀 Prêt à gagner de l'argent avec Appyna !**
