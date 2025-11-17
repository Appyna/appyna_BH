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

  useEffect(() => {
    // Auto-redirect après 5 secondes
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckIcon />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
          Paiement réussi ! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6 font-montserrat">
          Votre annonce a été boostée avec succès ! Elle apparaît maintenant en tête des résultats avec un badge spécial.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 font-medium">
            Votre annonce est boostée pour {duration} jour{duration > 1 ? 's' : ''}
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

        <p className="text-xs text-gray-400 mt-6">
          Redirection automatique dans 5 secondes...
        </p>
      </div>
    </div>
  );
};
