import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const EmailConfirmationRedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Laisser Supabase gérer la confirmation automatiquement via l'URL
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur confirmation:', error);
          setStatus('error');
          return;
        }

        // Succès - email confirmé
        setStatus('success');

      } catch (err) {
        console.error('Erreur:', err);
        setStatus('error');
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-4 border-purple-600 mx-auto mb-4 sm:mb-6"></div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 font-montserrat">Confirmation en cours...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] bg-clip-text text-transparent mb-3 sm:mb-4 font-poppins px-2 whitespace-nowrap">
                Bienvenue sur Appyna
              </h1>
              <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] mx-auto mb-6 sm:mb-8"></div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-gray-700 font-montserrat px-2">
              <p className="text-lg sm:text-xl font-semibold">Votre compte a été activé avec succès.</p>
              <p className="text-base sm:text-lg leading-relaxed font-medium">
                Retournez maintenant sur Appyna pour accéder à votre compte.
              </p>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 font-poppins px-2">Erreur de confirmation</h1>
              <p className="text-base sm:text-lg text-gray-600 font-montserrat px-2">
                Une erreur est survenue lors de la confirmation de votre email. Veuillez réessayer ou contacter le support.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
