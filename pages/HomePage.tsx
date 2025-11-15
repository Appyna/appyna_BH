import React, { useState, useEffect, useCallback } from 'react';
import { ListingCard } from '../components/ListingCard';
import { CITIES_ISRAEL, Category, Listing, ListingType } from '../types';
import { listingsService } from '../lib/listingsService';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;

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
  const [displayedListings, setDisplayedListings] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'OFFER' | 'DEMAND'>('ALL');
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les annonces depuis Supabase
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      const listings = await listingsService.getListings();
      setAllListings(listings);
      setLoading(false);
    };
    loadListings();
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
  
  // Créer un tableau pour l'affichage avec pagination simple
  const visibleListings = filteredListings.slice(0, displayedListings);

  // Fonction pour charger plus d'annonces
  const loadMoreListings = useCallback(() => {
    if (isLoading || visibleListings.length >= filteredListings.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedListings(prev => prev + 12);
      setIsLoading(false);
    }, 500);
  }, [isLoading, visibleListings.length, filteredListings.length]);

  // Fonction de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayedListings(12); // Reset à 12 annonces lors d'une nouvelle recherche
  };

  // Reset des résultats quand les filtres changent
  useEffect(() => {
    setDisplayedListings(12);
  }, [searchTerm, selectedCategory, selectedCity]);

  // Détection du scroll pour charger plus
  useEffect(() => {
    const handleScroll = () => {
      // Ne pas charger plus s'il n'y a plus d'annonces à afficher
      if (visibleListings.length >= filteredListings.length || isLoading) return;
      
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreListings();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreListings, visibleListings.length, filteredListings.length, isLoading]);

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
              className="w-full pl-12 pr-6 py-3 sm:py-4 text-lg border-transparent rounded-2xl focus:ring-0 focus:outline-none placeholder-gray-500 font-montserrat"
            />
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
                {Object.values(Category).map(category => <option key={category} value={category}>{category}</option>)}
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
              Essayez de modifier vos critères de recherche ou{' '}
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCity('');
                }}
                className="text-primary-600 hover:text-primary-700 font-semibold underline"
              >
                effacez les filtres
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {visibleListings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} getRelativeTime={getRelativeTime} />
              ))}
            </div>
            
            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600 font-montserrat">Chargement...</span>
              </div>
            )}

            {/* Bouton "Voir plus" si on a plus d'annonces à afficher */}
            {!isLoading && visibleListings.length < filteredListings.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreListings}
                  className="bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
                >
                  Voir plus d'annonces ({filteredListings.length - visibleListings.length} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
