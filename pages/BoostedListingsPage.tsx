import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockListings } from '../data/mock';
import { BackButton } from '../components/BackButton';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const BoostedListingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filtrer les annonces de l'utilisateur qui sont actuellement boostées et non supprimées
  const boostedListings = mockListings.filter(
    listing => listing.userId === user?.id && listing.isBoosted
  );

  const formatBoostEndDate = (date: Date | undefined) => {
    if (!date) return 'Date non définie';
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-8 text-center">
          Mes annonces boostées
        </h1>

        {boostedListings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-poppins">
              Aucune annonce boostée
            </h2>
            <p className="text-gray-500 font-montserrat">
              Vous n'avez pas d'annonce boostée actuellement.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {boostedListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 group"
              >
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <ImageWithFallback
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 font-poppins truncate group-hover:text-primary-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 font-poppins mt-1">
                      {listing.price ? `${listing.price.toLocaleString('fr-FR')} ₪` : 'Prix non spécifié'}
                    </p>
                  </div>

                  {/* Date de fin de boost */}
                  <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-2 rounded-lg border border-primary-200">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-montserrat">Boost se termine le</p>
                        <p className="text-sm font-semibold text-primary-700 font-montserrat">
                          {formatBoostEndDate(listing.boostExpiresAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date responsive pour mobile */}
                <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-gray-600 font-montserrat">
                      Boost se termine le <span className="font-semibold text-primary-700">{formatBoostEndDate(listing.boostExpiresAt)}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bouton Historique */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/boost-history')}
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historique
          </button>
        </div>
      </div>
    </div>
  );
};
