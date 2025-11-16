import React from 'react';
import { Link } from 'react-router-dom';

const XCircleIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const BoostCancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircleIcon />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
          Paiement annulé
        </h1>
        
        <p className="text-gray-600 mb-6 font-montserrat">
          Vous avez annulé le processus de paiement. Aucun montant n'a été débité.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            💡 Vous pouvez booster votre annonce à tout moment depuis votre profil
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Retour à l'accueil
          </Link>
          
          <Link
            to="/profile"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-300"
          >
            Voir mes annonces
          </Link>
        </div>
      </div>
    </div>
  );
};
