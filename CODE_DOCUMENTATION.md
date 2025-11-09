# Appyna - Documentation du Code

## 📁 Structure détaillée du projet

### `package.json`
```json
{
  "name": "appyna",
  "dependencies": {
    "react": "^19.2.0",
    "react-router-dom": "6.24.1",
    "uuid": "9.0.1",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### `index.html` - Configuration Tailwind et Fonts
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
            montserrat: ['Montserrat', 'sans-serif'],
          },
          colors: {
            primary: {
              600: '#7C3AED',
              // ... palette complète
            },
            secondary: {
              500: '#2DD4BF',
              // ... palette complète
            }
          }
        }
      }
    };
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body class="font-poppins bg-white text-gray-900">
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

---

## 🎨 Design System

### Couleurs
```css
/* Violet principal */
primary-600: #7C3AED
primary-700: #6D28D9 (hover states)

/* Vert turquoise secondaire */
secondary-500: #2DD4BF
secondary-600: #0D9488 (hover states)

/* Gradients */
from-primary-600 to-secondary-500
from-purple-50 to-teal-50 (backgrounds)
```

### Typographie
```css
/* Titres et éléments importants */
font-family: 'Poppins', sans-serif
font-weight: 400, 500, 600, 700, 800

/* Texte de corps et navigation */
font-family: 'Montserrat', sans-serif
font-weight: 400, 500, 600, 700
```

### Espacement et bordures
```css
/* Bordures arrondies */
rounded-2xl: 16px (moderne et doux)
rounded-xl: 12px (éléments secondaires)

/* Ombres */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

/* Transitions */
transition-all duration-300
```

---

## 🧩 Composants principaux

### `App.tsx` - Router et Layout
```tsx
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer supprimé pour un design plus moderne */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          {/* ... autres routes */}
        </Routes>
      </Layout>
    </Router>
  );
};
```

### `HomePage.tsx` - Page principale
```tsx
export const HomePage: React.FC = () => {
  // Fonction pour les dates relatives
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 30) return `Il y a ${Math.floor(days/30)} mois`;
    if (days > 7) return `Il y a ${Math.floor(days/7)} semaine${Math.floor(days/7) > 1 ? 's' : ''}`;
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    // ... logique complète
  };

  // Combinaison des annonces (boostées en premier)
  const allListings = [
    ...mockListings.filter(l => l.isBoosted),
    ...mockListings.filter(l => !l.isBoosted)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins">
          La marketplace{' '}
          <span className="bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
            francophone
          </span>{' '}
          en Israël
        </h1>
        
        {/* Barre de recherche premium */}
        <div className="mt-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-3 sm:bg-white sm:p-3 sm:rounded-2xl sm:shadow-xl">
          {/* Champ de recherche principal */}
          <div className="relative w-full lg:flex-1 bg-white rounded-2xl sm:bg-transparent">
            <SearchIcon />
            <input
              type="text"
              placeholder="Chercher une annonce"
              className="w-full pl-12 pr-6 py-3 text-base border-transparent rounded-2xl focus:ring-0 focus:outline-none placeholder-gray-500 font-montserrat"
            />
          </div>
          
          {/* Sélecteur de villes */}
          <div className="relative w-full lg:w-72 bg-white rounded-2xl sm:bg-transparent">
            <select className="w-full lg:w-72 pl-12 lg:pl-4 pr-10 py-3 text-base border-transparent rounded-2xl focus:ring-0 focus:outline-none bg-transparent appearance-none text-gray-700 font-montserrat">
              <option>Tout Israël</option>
              {CITIES_ISRAEL.map(city => <option key={city}>{city}</option>)}
            </select>
          </div>
          
          {/* Sélecteur de catégories */}
          <div className="relative w-full lg:w-80 bg-white rounded-2xl sm:bg-transparent">
            <select className="w-full lg:w-80 pl-4 pr-10 py-3 text-base border-transparent rounded-2xl focus:ring-0 focus:outline-none bg-transparent appearance-none text-gray-700 font-montserrat">
              <option>Toutes les catégories</option>
              {Object.values(Category).map(category => <option key={category}>{category}</option>)}
            </select>
          </div>
          
          {/* Bouton de recherche */}
          <button className="w-full lg:w-auto flex-shrink-0 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat">
            Rechercher
          </button>
        </div>
      </div>

      {/* Section des annonces */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {allListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} getRelativeTime={getRelativeTime} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### `ListingCard.tsx` - Carte d'annonce
```tsx
interface ListingCardProps {
  listing: Listing;
  getRelativeTime?: (date: Date) => string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, getRelativeTime }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block group font-montserrat transform transition-all duration-300 hover:scale-105">
      <div className="relative w-full overflow-hidden rounded-2xl aspect-square bg-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay avec badge et favoris */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          {listing.isBoosted && (
            <div className="flex items-center bg-gradient-to-r from-primary-600/90 to-secondary-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
              <ZapIcon />
              BOOSTÉ
            </div>
          )}
          <div className="flex-grow"></div>
          <button onClick={toggleFavorite} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm hover:scale-110">
            <HeartIcon filled={isFavorite} />
          </button>
        </div>
      </div>
      
      {/* Informations de l'annonce */}
      <div className="mt-4 px-1">
        <h3 className="text-base font-medium text-gray-800 truncate group-hover:text-primary-600 transition-colors font-poppins">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500 font-montserrat">{listing.city}</p>
          {getRelativeTime && (
            <p className="text-xs text-gray-400 font-montserrat">
              {getRelativeTime(listing.createdAt)}
            </p>
          )}
        </div>
        <p className="text-lg font-semibold text-gray-900 mt-2 font-poppins">
          {listing.price ? `${listing.price.toLocaleString('fr-FR')} ₪` : 'Demande'}
        </p>
      </div>
    </Link>
  );
};
```

### `Header.tsx` - Navigation
```tsx
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
              <Logo />
            </Link>
          </div>
          
          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/create" className="flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-sm">
              <PlusIcon />
              Poster une annonce
            </Link>

            {/* Authentification */}
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-primary-600 font-montserrat transition-colors text-sm">
                Connexion
              </Link>
              <Link to="/signup" className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white px-5 py-2 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm">
                Inscription
              </Link>
            </div>
          </div>
          
          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary-600 focus:outline-none p-2 rounded-lg hover:bg-purple-50 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile déplié */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg py-4 px-4 space-y-3 border-t border-purple-100">
          <Link to="/create" className="flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg text-sm">
            <PlusIcon /> Poster une annonce
          </Link>
          <div className="flex flex-col space-y-3 pt-2">
            <Link to="/login" className="text-center w-full px-4 py-2.5 text-gray-600 font-medium bg-gray-100 rounded-xl font-montserrat transition-colors text-sm">
              Connexion
            </Link>
            <Link to="/signup" className="text-center bg-gradient-to-r from-primary-600 to-secondary-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 shadow-lg text-sm">
              Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
```

### `types.ts` - Définitions TypeScript
```tsx
export enum ListingType {
  OFFER = 'OFFRE',
  DEMAND = 'DEMANDE',
}

export enum Category {
  SERVICES = 'Services',
  OBJECTS = 'Objets',
  IMMOBILIER = 'Immobilier',
  EMPLOI = 'Emploi',
  VEHICULES = 'Véhicules',
  VACANCES = 'Vacances',
}

export const CITIES_ISRAEL = [
  "Jérusalem", "Tel Aviv", "Haïfa", "Rishon LeZion", "Petah Tikva", 
  "Ashdod", "Netanya", "Beer-Sheva", "Bnei Brak", "Holon", "Ramat Gan",
  "Ashkelon", "Rehovot", "Bat Yam", "Herzliya", "Kfar Saba", "Modiin",
  "Raanana", "Eilat"
];

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  price?: number;
  category: Category;
  city: string;
  imageUrl: string;
  type: ListingType;
  isBoosted: boolean;
  boostExpiresAt?: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  favorites: string[];
}
```

---

## 🎯 Points clés de l'implémentation

### 1. **Responsive Design**
```css
/* Mobile First */
grid-cols-1          /* Base: 1 colonne */
md:grid-cols-3       /* Desktop: 3 colonnes */

/* Barre de recherche adaptative */
flex-col lg:flex-row /* Mobile: vertical, Desktop: horizontal */
w-full lg:w-72       /* Mobile: pleine largeur, Desktop: largeur fixe */
```

### 2. **Design System cohérent**
```css
/* Gradients unifiés */
bg-gradient-to-r from-primary-600 to-secondary-500

/* Transitions fluides */
transition-all duration-300

/* Hover effects */
hover:scale-105 transform
```

### 3. **Typographie hiérarchisée**
```css
/* Titres */
font-poppins font-bold text-4xl md:text-5xl

/* Texte de corps */
font-montserrat font-medium text-base

/* Éléments secondaires */
font-montserrat text-sm text-gray-500
```

### 4. **Performance et UX**
- Hot reload avec Vite
- Lazy loading des images
- Transitions CSS optimisées
- États de hover interactifs
- Responsive breakpoints fluides

---

*Cette documentation technique complète le journal de développement et peut servir de référence pour la maintenance et l'évolution du projet Appyna.*
