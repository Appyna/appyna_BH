import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CheckIcon = () => (
  <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const BoostSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [duration, setDuration] = useState<number>(7);

  useEffect(() => {
    // Récupérer la durée depuis sessionStorage
    const storedDuration = sessionStorage.getItem('boost_duration');
    if (storedDuration) {
      setDuration(parseInt(storedDuration));
      sessionStorage.removeItem('boost_duration');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-5">
          <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-semibold text-gray-900 mb-5 font-poppins">
          Paiement réussi !
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
          <p className="text-sm text-green-800 font-medium">
            Votre annonce est boostée pour {duration} jour{duration > 1 ? 's' : ''}
          </p>
        </div>
        
        <p className="text-gray-600 mb-8 font-montserrat">
          Votre annonce apparaît maintenant en tête des résultats avec un badge spécial.
        </p>

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
