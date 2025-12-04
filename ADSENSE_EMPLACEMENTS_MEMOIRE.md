# 📍 EMPLACEMENTS PUBLICITAIRES GOOGLE ADSENSE
**Documentation des emplacements publicitaires temporairement désactivés**  
**Date de désactivation:** 4 décembre 2025  
**Raison:** En attente de l'approbation Google AdSense

---

## 🎯 RÉSUMÉ DES EMPLACEMENTS

**Total:** 4 espaces publicitaires stratégiques  
**Publisher ID:** `ca-pub-9696924758873501`  
**Composant:** `components/AdBanner.tsx` (conservé et fonctionnel)

---

## 📱 EMPLACEMENT 1 : HomePage - Mobile (toutes les 5 annonces)

**Fichier:** `pages/HomePage.tsx`  
**Lignes:** ~365-374  
**Format:** Bannière horizontale (320x50)  
**Slot ID:** `4499959690`  
**Fréquence:** Toutes les 5 annonces  
**Visibilité:** Mobile uniquement (`md:hidden`)

```tsx
{(index + 1) % 5 === 0 && (
  <div className="md:hidden col-span-1">
    <AdBanner 
      format="horizontal" 
      adSlot="4499959690"
      className="my-6"
    />
  </div>
)}
```

**Positionnement:** Entre les cartes d'annonces dans la grille mobile  
**Performance attendue:** Fort engagement (utilisateur scroll naturel)

---

## 💻 EMPLACEMENT 2 : HomePage - Desktop (toutes les 6 annonces)

**Fichier:** `pages/HomePage.tsx`  
**Lignes:** ~376-383  
**Format:** Bannière horizontale (728x90)  
**Slot ID:** À configurer  
**Fréquence:** Toutes les 6 annonces (2 rangées de 3)  
**Visibilité:** Desktop uniquement (`hidden md:block md:col-span-3`)

```tsx
{(index + 1) % 6 === 0 && (
  <div className="hidden md:block md:col-span-3">
    <AdBanner 
      format="horizontal" 
      adSlot="SLOT_A_CONFIGURER"
      className="my-8"
    />
  </div>
)}
```

**Positionnement:** Entre les rangées d'annonces (grille 3 colonnes)  
**Performance attendue:** Très bonne visibilité sur grand écran

---

## 🖼️ EMPLACEMENT 3 : ListingDetailPage - Sidebar Desktop

**Fichier:** `pages/ListingDetailPage.tsx`  
**Lignes:** ~537-543  
**Format:** Rectangle carré (300x250)  
**Slot ID:** `6772460317`  
**Fréquence:** Permanent sur la page  
**Visibilité:** Desktop uniquement (`hidden lg:block`)

```tsx
<div className="hidden lg:block">
  <AdBanner 
    format="square" 
    adSlot="6772460317"
  />
</div>
```

**Positionnement:** Colonne de droite, à côté du contenu principal  
**Performance attendue:** Excellente (temps de lecture long sur détail annonce)

---

## 📲 EMPLACEMENT 4 : ListingDetailPage - Mobile Bas de Page

**Fichier:** `pages/ListingDetailPage.tsx`  
**Lignes:** ~549-555  
**Format:** Bannière horizontale (320x50)  
**Slot ID:** `3278393270`  
**Fréquence:** Permanent sur la page  
**Visibilité:** Mobile uniquement (`lg:hidden`)

```tsx
<div className="lg:hidden mt-8 pb-8">
  <AdBanner 
    format="horizontal" 
    adSlot="3278393270"
  />
</div>
```

**Positionnement:** En bas de page après tout le contenu  
**Performance attendue:** Bonne (utilisateur a fini de consulter l'annonce)

---

## 🛠️ COMPOSANT ADBANNER

**Fichier:** `components/AdBanner.tsx` (120 lignes)  
**Status:** ✅ Conservé et fonctionnel  
**Formats supportés:** 
- `horizontal`: 728x90 (desktop) / 320x50 (mobile)
- `vertical`: 300x600 (desktop) / 300x250 (mobile)  
- `square`: 300x250

**Props:**
```typescript
interface AdBannerProps {
  format: 'horizontal' | 'vertical' | 'square';
  adSlot?: string; // Slot ID Google AdSense
  className?: string;
}
```

**Comportement:**
- **Mode développement:** Affiche un placeholder gris avec icône
- **Mode production:** Charge le vrai bloc AdSense

---

## 📄 SCRIPT ADSENSE DANS INDEX.HTML

**Fichier:** `index.html`  
**Lignes:** ~18-20

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9696924758873501"
     crossorigin="anonymous"></script>
```

**Status:** ✅ Conservé (pas de désactivation nécessaire)

---

## 🔄 PROCÉDURE DE RÉACTIVATION

Une fois l'approbation Google AdSense reçue :

### Étape 1 : Décommenter les imports

**HomePage.tsx (ligne ~4):**
```tsx
// Remplacer:
// import { AdBanner } from '../components/AdBanner'; // TEMPORAIREMENT DÉSACTIVÉ

// Par:
import { AdBanner } from '../components/AdBanner';
```

**ListingDetailPage.tsx (ligne ~7):**
```tsx
// Remplacer:
// import { AdBanner } from '../components/AdBanner'; // TEMPORAIREMENT DÉSACTIVÉ

// Par:
import { AdBanner } from '../components/AdBanner';
```

### Étape 2 : Décommenter les blocs publicitaires

**HomePage.tsx (lignes ~365-383):**
- Retirer `{/*` au début
- Retirer `*/}` à la fin
- Restaurer les deux blocs mobile et desktop

**ListingDetailPage.tsx (lignes ~537-555):**
- Retirer `{/*` et `*/}` autour du bloc sidebar
- Retirer `{/*` et `*/}` autour du bloc mobile

### Étape 3 : Configurer le Slot manquant

**HomePage.tsx Desktop (ligne ~379):**
```tsx
adSlot="REMPLACER_PAR_SLOT_ID_REEL" // À créer dans Google AdSense
```

### Étape 4 : Tester en production

```bash
npm run build
# Déployer sur Vercel/Netlify
# Vérifier dans Google AdSense > Rapports
```

---

## 📊 PERFORMANCE ESTIMÉE

**Revenus estimés (après approbation):**
- **HomePage Mobile:** 40-60 impressions/jour → ~0.50₪/jour
- **HomePage Desktop:** 30-50 impressions/jour → ~0.80₪/jour
- **Detail Sidebar:** 100-150 impressions/jour → ~1.50₪/jour
- **Detail Mobile:** 80-120 impressions/jour → ~0.90₪/jour

**Total estimé:** ~3.70₪/jour → ~110₪/mois (pour 100 visiteurs/jour)

---

## 📝 NOTES IMPORTANTES

1. ✅ **Composant AdBanner non supprimé** - Prêt à être réutilisé
2. ✅ **Script AdSense dans index.html conservé** - Pas d'impact
3. ✅ **Slot IDs documentés** - Pas besoin de les recréer
4. ⚠️ **Approbation Google:** Compter 1-2 semaines après soumission
5. 💡 **Alternative temporaire:** Laisser vide ou proposer contenu sponsorisé interne

---

## 🔗 RESSOURCES

- **Documentation complète:** `GOOGLE_ADSENSE_SETUP.md`
- **Guide rapide:** `ADSENSE_QUICKSTART.md`
- **Aperçu visuel:** `ADS_VISUAL_PREVIEW.md`
- **Compte AdSense:** https://www.google.com/adsense

---

**✅ Toutes les informations sont sauvegardées. Réactivation simple en 3 minutes !**
