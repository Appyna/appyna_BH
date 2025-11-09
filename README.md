# Appyna - Marketplace francophone en Israël

## 🚀 Vue d'ensemble

Appyna est une marketplace moderne et élégante conçue spécialement pour la communauté francophone en Israël. Développée avec React, TypeScript et Tailwind CSS, elle offre une expérience utilisateur fluide et professionnelle.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-blue.svg)

## ✨ Fonctionnalités principales

### 🎯 Recherche avancée
- **Recherche textuelle** intuitive
- **Filtres géographiques** (19 villes d'Israël)
- **Catégories spécialisées** (Services, Objets, Immobilier, Emploi, Véhicules, Vacances)
- **Interface responsive** adaptée mobile et desktop

### 📱 Design moderne
- **Design system cohérent** violet (#7C3AED) et turquoise (#2DD4BF)
- **Typographie élégante** Poppins/Montserrat
- **Animations fluides** et micro-interactions
- **Interface épurée** sans encombrement

### 🏠 Mise en page optimisée
- **Mobile** : 1 annonce par ligne pour une lecture facile
- **Desktop** : 3 annonces par ligne pour maximiser l'espace
- **Dates relatives** ("Il y a 2 jours", "Il y a 1 semaine")
- **Badges "BOOSTÉ"** pour les annonces mises en avant

## 🛠️ Installation et lancement

### Prérequis
- Node.js 18+ (recommandé 20+)
- npm ou yarn

### Lancement rapide
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Scripts disponibles
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build de production
```

## 🏗️ Architecture technique

### Stack
- **Frontend** : React 19.2.0 avec hooks modernes
- **Langage** : TypeScript pour la sécurité des types
- **Styling** : Tailwind CSS avec configuration personnalisée
- **Build** : Vite 6.2.0 pour des builds ultra-rapides
- **Routing** : React Router DOM 6.24.1

### Structure du projet
```
appyna/
├── components/           # Composants réutilisables
│   ├── Header.tsx       # Navigation principale
│   ├── ListingCard.tsx  # Carte d'annonce avec dates
│   └── icons/Logo.tsx   # Logo optimisé
├── pages/               # Pages principales
│   ├── HomePage.tsx     # Page d'accueil unifiée
│   ├── ListingDetailPage.tsx
│   └── ...
├── data/                # Données et mocks
│   └── mock.ts         # Données de test
├── types.ts            # Définitions TypeScript
├── App.tsx             # Router et layout principal
└── index.html          # Configuration et fonts
```

## 🎨 Design System

### Couleurs principales
```css
/* Violet principal */
#7C3AED (primary-600)

/* Vert turquoise secondaire */  
#2DD4BF (secondary-500)

/* Gradients */
from-primary-600 to-secondary-500
from-purple-50 to-teal-50
```

### Typographie
- **Titres et éléments importants** : Poppins (400, 500, 600, 700, 800)
- **Texte de corps et navigation** : Montserrat (400, 500, 600, 700)

### Principes de design
- **Soft et élégant** : Coins arrondis (rounded-2xl), ombres douces
- **Professionnel** : Polices raffinées, espacement généreux
- **Interactif** : Hover effects, transitions fluides (duration-300)

## 🎯 Spécificités Israël

### Villes supportées
Jérusalem, Tel Aviv, Haïfa, Rishon LeZion, Petah Tikva, Ashdod, Netanya, Beer-Sheva, Bnei Brak, Holon, Ramat Gan, Ashkelon, Rehovot, Bat Yam, Herzliya, Kfar Saba, Modiin, Raanana, Eilat

### Catégories
- Services
- Objets  
- Immobilier
- Emploi
- Véhicules
- Vacances

### Devise
Prix affichés en Shekels (₪) avec formatage français

## 🔄 Évolutions futures

### Fonctionnalités prévues
- [ ] Système d'authentification
- [ ] Filtres fonctionnels
- [ ] Pagination des résultats
- [ ] Système de messagerie
- [ ] Profils utilisateurs
- [ ] Système de favoris persistant

## 📚 Documentation

- `DEVELOPMENT_LOG.md` - Journal détaillé de développement
- `CODE_DOCUMENTATION.md` - Documentation technique complète

---

## 🏆 Crédits

**Développé en novembre 2025**
- Design system violet/turquoise
- Interface responsive optimisée
- Expérience utilisateur premium

*Appyna - La marketplace francophone moderne en Israël* 🇮🇱
