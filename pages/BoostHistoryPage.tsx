import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockListings } from '../data/mock';
import { BackButton } from '../components/BackButton';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const BoostHistoryPage: React.FC = () => {
  const { user } = useAuth();

  // Filtrer les annonces de l'utilisateur qui ont été boostées dans le passé (boost terminé)
  // Pour la simulation, on considère les annonces non-boostées comme ayant un boost terminé
  const pastBoostedListings = mockListings.filter(
    listing => listing.userId === user?.id && !listing.isBoosted && listing.boostExpiresAt
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
          Historique des boosts
        </h1>
        <p className="text-gray-600 font-montserrat mb-8">
          Toutes vos annonces qui ont été boostées par le passé
        </p>

        {pastBoostedListings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-poppins">
              Aucun historique
            </h2>
            <p className="text-gray-500 font-montserrat">
              Vous n'avez pas encore d'annonces avec un boost terminé.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastBoostedListings.map((listing) => (
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

                  {/* Badge Boost terminé */}
                  <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-600 font-montserrat">
                        Boost terminé
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge responsive pour mobile */}
                <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 font-montserrat font-semibold">
                      Boost terminé
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
