
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Listing, ListingType } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { ProtectedAction } from './ProtectedAction';
import { useAuth } from '../contexts/AuthContext';

interface ListingCardProps {
  listing: Listing;
  getRelativeTime?: (date: Date) => string;
  fromFavorites?: boolean; // Page favoris
  fromProfile?: boolean; // Page profil
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${filled ? 'text-red-500' : 'text-white'}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

const ZapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
);


export const ListingCard: React.FC<ListingCardProps> = ({ listing, getRelativeTime, fromFavorites = false, fromProfile = false }) => {
  const { user, toggleFavorite: toggleFavoriteContext } = useAuth();
  const location = useLocation();
  const isFavorite = user?.favorites.includes(listing.id) || false;
  const isOwnListing = user?.id === listing.userId;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteContext(listing.id);
  };

  // Sauvegarder la position de scroll avant de naviguer
  const handleClick = () => {
    // Utiliser le chemin actuel par défaut
    let returnPath = location.pathname + location.search;
    
    // IMPORTANT: Forcer le chemin de retour selon la page d'origine
    if (fromFavorites) {
      returnPath = '/favorites';
    } else if (fromProfile) {
      // Garder le chemin complet du profil
      returnPath = location.pathname; // Ex: /profile/user-id
    }
    
    const scrollPosition = window.scrollY;
    const existingPosition = sessionStorage.getItem('scroll_position');
    const existingPath = sessionStorage.getItem('return_path');
    
    // Sauvegarder seulement si :
    // 1. On a scrollé (position > 50px minimum)
    // 2. OU il n'y a pas de position existante pour ce chemin
    // 3. OU on change de chemin
    const shouldSave = scrollPosition > 50 || 
                      existingPath !== returnPath || 
                      !existingPosition;
    
    if (shouldSave) {
      sessionStorage.setItem('scroll_position', scrollPosition.toString());
      sessionStorage.setItem('return_path', returnPath);
    }
  };

  // Préserver les query params
  const linkTo = {
    pathname: `/listing/${listing.id}`,
    search: location.search,
  };

  return (
    <Link to={linkTo} onClick={handleClick} className="block group font-montserrat transform transition-all duration-300 hover:scale-105">
      <div className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] md:aspect-square bg-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <ImageWithFallback
          key={`card-${listing.id}-${listing.images?.[0]}`}
          src={listing.images?.[0]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge "Annonce supprimée" pour admin et propriétaire */}
        {(listing as any).isHidden && (isOwnListing || user?.is_admin) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm text-center shadow-2xl">
              Annonce supprimée<br/>pour signalements
            </div>
          </div>
        )}
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
           {listing.boostedUntil && new Date(listing.boostedUntil) > new Date() && (
             <div className="flex items-center gap-1 bg-gradient-to-r from-primary-600/90 to-secondary-500/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md shadow-lg">
               <ZapIcon />
               BOOSTÉ
             </div>
           )}
           <div className="flex-grow"></div>
            {!isOwnListing && (
              <ProtectedAction>
                <button onClick={toggleFavorite} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm hover:scale-110">
                    <HeartIcon filled={isFavorite} />
                </button>
              </ProtectedAction>
            )}
        </div>
        <div className="absolute bottom-0 right-0 p-4">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm shadow-lg text-white ${
            listing.type === ListingType.OFFER 
              ? 'bg-[#7C3AED]/70' 
              : 'bg-[#2DD4BF]/70'
          }`}>
            {listing.type === ListingType.OFFER ? 'OFFRE' : 'DEMANDE'}
          </div>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-lg font-medium text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors font-poppins">{listing.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-700 font-montserrat font-medium">{listing.city}</p>
          {getRelativeTime && (
            <p className="text-base font-semibold text-gray-900 font-poppins">
              {listing.price ? `${listing.price.toLocaleString('fr-FR')} ₪` : 'Aucun prix'}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-400 font-montserrat mt-1">
          {getRelativeTime ? getRelativeTime(new Date(listing.createdAt)) : ''}
        </p>
      </div>
    </Link>
  );
};
