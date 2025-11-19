import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface BoostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  showSuccessMessage?: boolean;
}

export const BoostListingModal: React.FC<BoostListingModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  showSuccessMessage = false
}) => {
  const { user } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  console.log('🎨 BoostListingModal rendered with showSuccessMessage:', showSuccessMessage);

  if (!isOpen) return null;

  const handleBoost = async () => {
    if (!user) {
      setError('Vous devez être connecté');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Appeler l'Edge Function pour créer la session Stripe
      const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          listingId,
          userId: user.id,
          duration: selectedDuration
        }
      });

      if (functionError) throw functionError;

      // Sauvegarder la durée pour l'afficher sur la page de succès
      sessionStorage.setItem('boost_duration', selectedDuration.toString());
      
      // Rediriger vers Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err: any) {
      console.error('Erreur boost:', err);
      setError(err.message || 'Erreur lors de la création du paiement');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 my-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl shadow-sm">
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-bold text-base sm:text-lg font-poppins">
                Annonce publiée avec succès !
              </p>
            </div>
          </div>
        )}
        
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-poppins text-center mb-6">
          Booster mon annonce
        </h3>
        
        <p className="text-gray-700 font-montserrat font-semibold mb-8 text-center text-sm sm:text-base">
          Maximisez vos réponses dès maintenant ! Boostez votre annonce pour apparaître en tête des recherches et sur la page d'accueil.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 1 jour */}
          <div 
            onClick={() => setSelectedDuration(1)}
            className={`border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
              selectedDuration === 1 
                ? 'border-primary-600 bg-primary-50 shadow-xl transform scale-105' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start mb-2">
              <input type="radio" name="boost" checked={selectedDuration === 1} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
              <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">Annonce boostée pendant 1 jour</span>
            </div>
            <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">9.90 <span className="text-base font-medium text-gray-500">₪</span></p>
          </div>

          {/* 3 jours */}
          <div 
            onClick={() => setSelectedDuration(3)}
            className={`relative border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
              selectedDuration === 3 
                ? 'border-primary-600 bg-primary-50 shadow-xl transform scale-105' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            <span className="text-xs font-bold bg-secondary-400 text-white px-2 py-0.5 rounded-full absolute -top-2.5 right-2">Populaire</span>
            <div className="flex items-start mb-2">
              <input type="radio" name="boost" checked={selectedDuration === 3} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
              <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">Annonce boostée pendant 3 jours</span>
            </div>
            <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">24.90 <span className="text-base font-medium text-gray-500">₪</span></p>
          </div>

          {/* 7 jours */}
          <div 
            onClick={() => setSelectedDuration(7)}
            className={`border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
              selectedDuration === 7 
                ? 'border-primary-600 bg-primary-50 shadow-xl transform scale-105' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start mb-2">
              <input type="radio" name="boost" checked={selectedDuration === 7} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
              <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">Annonce boostée pendant 7 jours</span>
            </div>
            <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">39.90 <span className="text-base font-medium text-gray-500">₪</span></p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-sm sm:text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
          >
            Ne pas booster
          </button>
          <button
            onClick={handleBoost}
            disabled={isLoading}
            className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Chargement...' : 'Booster'}
          </button>
        </div>
      </div>
    </div>
  );
};
