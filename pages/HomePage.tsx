import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListingCard } from '../components/ListingCard';
// import { AdBanner } from '../components/AdBanner'; // TEMPORAIREMENT DÉSACTIVÉ - En attente approbation Google AdSense
import { CITIES_ISRAEL, CATEGORIES_SORTED, Category, Listing, ListingType } from '../types';
import { listingsService } from '../lib/listingsService';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const ClearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// Function to get relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `Il y a ${months} mois`;
  if (weeks > 0) return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Il y a ${hours}h`;
  if (minutes > 0) return `Il y a ${minutes}min`;
  return 'À l\'instant';
};

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États pour pagination et chargement
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  // Lire depuis l'URL ou sessionStorage (backup)
  const searchTerm = searchParams.get('search') || sessionStorage.getItem('search_filter') || '';
  const selectedCategory = searchParams.get('category') || sessionStorage.getItem('category_filter') || '';
  const selectedCity = searchParams.get('city') || sessionStorage.getItem('city_filter') || '';
  const selectedType = (searchParams.get('type') as 'ALL' | 'OFFER' | 'DEMAND') || (sessionStorage.getItem('type_filter') as 'ALL' | 'OFFER' | 'DEMAND') || 'ALL';

  // Restaurer les filtres depuis sessionStorage au montage
  React.useEffect(() => {
    const hasUrlParams = searchParams.toString().length > 0;
    if (!hasUrlParams) {
      const params = new URLSearchParams();
      const savedSearch = sessionStorage.getItem('search_filter');
      const savedCategory = sessionStorage.getItem('category_filter');
      const savedCity = sessionStorage.getItem('city_filter');
      const savedType = sessionStorage.getItem('type_filter');

      if (savedSearch) params.set('search', savedSearch);
      if (savedCategory) params.set('category', savedCategory);
      if (savedCity) params.set('city', savedCity);
      if (savedType) params.set('type', savedType);

      if (params.toString()) {
        setSearchParams(params, { replace: true });
      }
    }
  }, []);

  // Fonctions pour mettre à jour les filtres
  const setSearchTerm = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
      sessionStorage.setItem('search_filter', value);
    } else {
      params.delete('search');
      sessionStorage.removeItem('search_filter');
    }
    setSearchParams(params);
  };

  const setSelectedCategory = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('category', value);
      sessionStorage.setItem('category_filter', value);
    } else {
      params.delete('category');
      sessionStorage.removeItem('category_filter');
    }
    setSearchParams(params);
  };

  const setSelectedCity = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('city', value);
      sessionStorage.setItem('city_filter', value);
    } else {
      params.delete('city');
      sessionStorage.removeItem('city_filter');
    }
    setSearchParams(params);
  };

  const setSelectedType = (value: 'ALL' | 'OFFER' | 'DEMAND') => {
    const params = new URLSearchParams(searchParams);
    if (value !== 'ALL') {
      params.set('type', value);
      sessionStorage.setItem('type_filter', value);
    } else {
      params.delete('type');
      sessionStorage.removeItem('type_filter');
    }
    setSearchParams(params);
  };

  // Charger les annonces avec pagination
  useEffect(() => {
    const loadInitialListings = async () => {
      setLoading(true);
      
      // Vérifier si on doit restaurer vers un index spécifique
      const savedIndex = sessionStorage.getItem('listing_index');
      const returnPath = sessionStorage.getItem('return_path');
      const currentPath = window.location.pathname + window.location.search;
      
      if (savedIndex && returnPath === currentPath) {
        // Mode restauration : charger jusqu'à l'index sauvegardé + marge
        const targetIndex = parseInt(savedIndex);
        const pagesToLoad = Math.ceil((targetIndex + 20) / itemsPerPage);
        

        
        // Charger toutes les pages nécessaires
        const allPages = await Promise.all(
          Array.from({ length: pagesToLoad }, (_, i) => 
            listingsService.getListings({ page: i + 1, limit: itemsPerPage })
          )
        );
        
        const listings = allPages.flat();
        setAllListings(listings);
        setCurrentPage(pagesToLoad);
        setHasMore(listings.length === pagesToLoad * itemsPerPage);
        setLoading(false);
        
        // Attendre que React ait fini de render + un délai supplémentaire
        setTimeout(() => {
          const cards = document.querySelectorAll('.listing-card');

          const targetCard = cards[targetIndex];
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'instant', block: 'start' });
            console.log(`✅ Scroll restauré vers l'index ${targetIndex}`);
            // Nettoyer après restauration réussie
            sessionStorage.removeItem('listing_index');
          } else {
            console.log(`⚠️ Card index ${targetIndex} introuvable (total: ${cards.length})`);
          }
        }, 100);
        return; // Important: sortir ici pour ne pas exécuter setLoading(false) deux fois
      } else {
        // Chargement normal : première page
        const listings = await listingsService.getListings({ page: 1, limit: itemsPerPage });
        setAllListings(listings);
        setCurrentPage(1);
        setHasMore(listings.length === itemsPerPage);
      }
      
      setLoading(false);
    };
    
    loadInitialListings();
  }, []);

  // Les annonces sont déjà triées par listingsService.getListings()
  // (annonces boostées actives en premier, puis par date de création)
  
  // Filtrer les annonces selon les critères de recherche
  const filteredListings = allListings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Toutes les catégories' || 
      listing.category === selectedCategory;
    
    const matchesCity = selectedCity === '' || selectedCity === 'Toutes les villes' || 
      listing.city === selectedCity;
    
    const matchesType = selectedType === 'ALL' || 
      (selectedType === 'OFFER' && listing.type === ListingType.OFFER) ||
      (selectedType === 'DEMAND' && listing.type === ListingType.DEMAND);
    
    return matchesSearch && matchesCategory && matchesCity && matchesType;
  });
  
  // Fonction pour charger la page suivante
  const loadMoreListings = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const newListings = await listingsService.getListings({ page: nextPage, limit: itemsPerPage });
    
    if (newListings.length > 0) {
      setAllListings(prev => {
        const combined = [...prev, ...newListings];
        // Re-trier tout le tableau pour garantir l'ordre correct
        return combined.sort((a, b) => {
          const now = new Date();
          const aBoostActive = a.boostedUntil && new Date(a.boostedUntil) > now;
          const bBoostActive = b.boostedUntil && new Date(b.boostedUntil) > now;
          
          // 1. Les annonces boostées actives d'abord
          if (aBoostActive && !bBoostActive) return -1;
          if (!aBoostActive && bBoostActive) return 1;
          
          // 2. Si les deux sont boostées, tri par date de boost (plus récent d'abord)
          if (aBoostActive && bBoostActive) {
            const aBoostDate = new Date(a.boostedAt || a.createdAt).getTime();
            const bBoostDate = new Date(b.boostedAt || b.createdAt).getTime();
            return bBoostDate - aBoostDate;
          }
          
          // 3. Si aucune n'est boostée, tri par date de création (plus récent d'abord)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });
      setCurrentPage(nextPage);
      setHasMore(newListings.length === itemsPerPage);
    } else {
      setHasMore(false);
    }
    
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, currentPage]);

  // Fonction de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Les filtres sont appliqués côté client sur allListings
  };

  // Détection du scroll pour charger plus
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoadingMore) return;
      
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreListings();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreListings, hasMore, isLoadingMore]);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 lg:pt-24 pb-8 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 font-poppins text-center">
          <span className="text-gray-800">La </span>
          <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">marketplace</span>
          <span className="text-gray-800"> francophone en Israël</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 font-montserrat font-medium text-center">
          Vendez, trouvez, achetez tout ce que vous souhaitez.
        </p>
        <form onSubmit={handleSearch} className="mt-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-3 sm:bg-white sm:p-3 sm:rounded-2xl sm:shadow-xl sm:backdrop-blur-sm">
          <div className="relative w-full lg:flex-1 bg-white rounded-2xl sm:bg-transparent sm:rounded-none">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Rechercher une annonce"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 sm:py-4 text-lg border-transparent rounded-2xl focus:ring-0 focus:outline-none placeholder-gray-500 font-montserrat"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
              >
                <ClearIcon />
              </button>
            )}
          </div>
          <div className="relative w-full lg:w-72 bg-white rounded-2xl sm:bg-transparent sm:rounded-none">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none lg:hidden">
                <LocationIcon />
             </div>
             <select 
               value={selectedCity}
               onChange={(e) => setSelectedCity(e.target.value)}
               className="w-full lg:w-72 pl-12 lg:pl-4 pr-10 py-3 text-base border-transparent rounded-2xl focus:ring-0 focus:outline-none bg-transparent appearance-none text-gray-700 font-montserrat"
             >
                <option value="">Toutes les villes</option>
                {CITIES_ISRAEL.map(city => <option key={city} value={city}>{city}</option>)}
             </select>
          </div>
          <div className="relative w-full lg:w-80 bg-white rounded-2xl sm:bg-transparent sm:rounded-none">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none lg:hidden">
                <CategoryIcon />
             </div>
             <select 
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="w-full lg:w-80 pl-12 lg:pl-4 pr-10 py-3 text-base border-transparent rounded-2xl focus:ring-0 focus:outline-none bg-transparent appearance-none text-gray-700 font-montserrat"
             >
                <option value="">Toutes les catégories</option>
                {CATEGORIES_SORTED.map(category => <option key={category} value={category}>{category}</option>)}
             </select>
          </div>
          <button 
            type="submit"
            className="w-full lg:w-auto flex-shrink-0 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
          >
            Rechercher
          </button>
        </form>
      </div>
      
      {/* Type Filter Buttons */}
      <div className="container mx-auto px-4 pb-4">
        <div className="flex justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 font-montserrat ${
              selectedType === 'ALL'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setSelectedType('OFFER')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 font-montserrat ${
              selectedType === 'OFFER'
                ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Offres
          </button>
          <button
            onClick={() => setSelectedType('DEMAND')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 font-montserrat ${
              selectedType === 'DEMAND'
                ? 'bg-secondary-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Demandes
          </button>
        </div>
      </div>

      {/* Listings Section */}
      <div className="container mx-auto px-4 py-8">
        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 font-poppins mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-500 font-montserrat">
              Essayez de modifier vos critères de recherche ou effacez les filtres.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {filteredListings.map((listing, index) => (
                <React.Fragment key={listing.id}>
                  <ListingCard 
                    listing={listing} 
                    getRelativeTime={getRelativeTime}
                    listingIndex={index}
                  />
                  
                  {/* PUBLICITÉS TEMPORAIREMENT DÉSACTIVÉES - En attente approbation Google AdSense
                  
                  Publicité Mobile: toutes les 5 annonces
                  {(index + 1) % 5 === 0 && (
                    <div className="md:hidden col-span-1">
                      <AdBanner 
                        format="horizontal" 
                        adSlot="4499959690"
                        className="my-6"
                      />
                    </div>
                  )}
                  
                  Publicité Desktop: toutes les 2 rangées (6 annonces)
                  {(index + 1) % 6 === 0 && (
                    <div className="hidden md:block md:col-span-3">
                      <AdBanner 
                        format="horizontal" 
                        adSlot="6640598373"
                        className="my-8"
                      />
                    </div>
                  )}
                  */}
                </React.Fragment>
              ))}
            </div>
            
            {/* Indicateur de chargement */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600 font-montserrat">Chargement...</span>
              </div>
            )}

            {/* Message de fin si plus d'annonces */}
            {!hasMore && filteredListings.length > 0 && (
              <div className="text-center py-8 text-gray-500 font-montserrat">
                Vous avez vu toutes les annonces disponibles
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
