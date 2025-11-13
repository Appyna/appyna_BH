import React, { useState } from 'react';

interface BoostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoost: (days: number) => Promise<void>;
  listingTitle: string;
}

interface BoostOption {
  days: number;
  price: number;
  label: string;
  popular?: boolean;
}

const boostOptions: BoostOption[] = [
  { days: 3, price: 15, label: '3 jours' },
  { days: 7, price: 30, label: '7 jours', popular: true },
  { days: 14, price: 50, label: '14 jours' },
  { days: 30, price: 80, label: '30 jours' }
];

const ZapIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);

export const BoostListingModal: React.FC<BoostListingModalProps> = ({
  isOpen,
  onClose,
  onBoost,
  listingTitle
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(7); // Default: 7 jours (POPULAR)
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleBoost = async () => {
    setIsLoading(true);
    try {
      await onBoost(selectedDays);
      onClose();
    } catch (error) {
      console.error('Erreur boost:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOption = boostOptions.find(opt => opt.days === selectedDays);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ZapIcon className="h-6 w-6 text-yellow-300" />
                <h2 className="text-2xl font-bold">Booster votre annonce</h2>
              </div>
              <p className="text-white/90 text-sm">
                Augmentez la visibilité de "{listingTitle}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Benefits */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Avantages du boost
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Affichage en tête de liste
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Badge "BOOSTÉ" visible sur votre annonce
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Jusqu'à 5x plus de vues
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Vendu plus rapidement
              </li>
            </ul>
          </div>

          {/* Pricing Options */}
          <div className="space-y-3 mb-6">
            {boostOptions.map((option) => (
              <button
                key={option.days}
                onClick={() => setSelectedDays(option.days)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative ${
                  selectedDays === option.days
                    ? 'border-primary-500 bg-primary-50 shadow-md scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      LE PLUS POPULAIRE
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedDays === option.days
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedDays === option.days && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">{option.label}</div>
                      <div className="text-sm text-gray-500">
                        {option.price / option.days}₪ par jour
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{option.price}₪</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Comment ça marche ?</p>
                <p className="text-blue-700">
                  Une fois boostée, votre annonce apparaîtra en premier dans les résultats de recherche pendant toute la durée choisie. 
                  Vous pouvez renouveler le boost à tout moment.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleBoost}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : (
                <>
                  <ZapIcon className="h-5 w-5" />
                  Booster maintenant · {selectedOption?.price}₪
                </>
              )}
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            💡 Pour l'instant, le boost est gratuit pendant la phase de test
          </p>
        </div>
      </div>
    </div>
  );
};
