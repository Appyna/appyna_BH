import React from 'react';
import { BackButton } from '../components/BackButton';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-6 text-center">
            Politique de confidentialité
          </h1>
          
          <div className="prose prose-gray max-w-none font-montserrat">
            <p className="text-gray-600 text-center mb-8">
              Le contenu de la politique de confidentialité sera ajouté ici prochainement.
            </p>
            
            {/* Le contenu sera ajouté plus tard */}
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 font-medium">
                Contenu en cours de rédaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
