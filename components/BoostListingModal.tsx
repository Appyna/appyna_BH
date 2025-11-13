import React, { useState } from 'react';

interface BoostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoost: (days: number) => Promise<void>;
  listingTitle: string;
}

export const BoostListingModal: React.FC<BoostListingModalProps> = ({
  isOpen,
  onClose,
  onBoost,
  listingTitle
}) => {
  const [selectedBoost, setSelectedBoost] = useState<string>('3d');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleBoost = async () => {
    if (!selectedBoost) return;
    
    setIsLoading(true);
    try {
      const daysMap: Record<string, number> = {
        '24h': 1,
        '3d': 3,
        '7d': 7
      };
      await onBoost(daysMap[selectedBoost]);
      onClose();
    } catch (error) {
      console.error('Erreur boost:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins">
              Boostez votre annonce
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 font-montserrat mb-8 text-center text-sm sm:text-base">
          Les annonces boostées sont affichées en haut des pages pour multiplier les chances de réponse.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 24h */}
          <div 
            onClick={() => setSelectedBoost('24h')}
            className={`border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
              selectedBoost === '24h' 
                ? 'border-primary-600 bg-primary-50 shadow-xl transform scale-105' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start mb-2">
              <input type="radio" name="boost" checked={selectedBoost === '24h'} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
              <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">Annonce boostée pendant 24h</span>
            </div>
            <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">9,90 <span className="text-base font-medium text-gray-500">₪</span></p>
          </div>

          {/* 3 jours */}
          <div 
            onClick={() => setSelectedBoost('3d')}
            className={`relative border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
              selectedBoost === '3d' 
                ? 'border-primary-600 bg-primary-50 shadow-xl transform scale-105' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            <span className="text-xs font-bold bg-secondary-400 text-white px-2 py-0.5 rounded-full absolute -top-2.5 right-2">Populaire</span>
            <div className="flex items-start mb-2">
              <input type="radio" name="boost" checked={selectedBoost === '3d'} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
              <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">Annonce boostée pendant 3 jours</span>
            </div>
            <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">19,90 <span className="text-base font-medium text-gray-500">₪</span></p>
          </div>

          {/* 7 jours */}
          <div 
            onClick={() => setSelectedBoost('7d')}
            className={`border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
              selectedBoost === '7d' 
                ? 'border-primary-600 bg-primary-50 shadow-xl transform scale-105' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start mb-2">
              <input type="radio" name="boost" checked={selectedBoost === '7d'} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
              <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">Annonce boostée pendant 7 jours</span>
            </div>
            <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">39,90 <span className="text-base font-medium text-gray-500">₪</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
          >
            Annuler
          </button>
          <button
            onClick={handleBoost}
            disabled={isLoading}
            className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Chargement...' : 'Valider'}
          </button>
        </div>
      </div>
    </div>
  );
};
