import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BackButton } from '../components/BackButton';
import { ListingCard } from '../components/ListingCard';
import { listingsService } from '../lib/listingsService';
import { Listing } from '../types';

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

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les annonces favorites depuis Supabase
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.favorites || user.favorites.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const allListings = await listingsService.getListings();
      const favorites = allListings.filter(listing => 
        user.favorites.includes(listing.id)
      );
      setFavoriteListings(favorites);
      setLoading(false);
    };

    loadFavorites();
  }, [user?.favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackButton />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="text-center py-20">Chargement de vos favoris...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
            Mes favoris
          </h1>
          <p className="text-gray-600 font-montserrat">
            {favoriteListings.length} {favoriteListings.length > 1 ? 'annonces sauvegardées' : 'annonce sauvegardée'}
          </p>
        </div>

        {favoriteListings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-poppins">
              Aucun favori pour le moment
            </h2>
            <p className="text-gray-500 font-montserrat mb-6">
              Parcourez les annonces et ajoutez-les à vos favoris en cliquant sur le cœur
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Découvrir les annonces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} getRelativeTime={getRelativeTime} fromFavorites={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
