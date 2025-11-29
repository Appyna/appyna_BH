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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 font-montserrat">Confirmation en cours...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] bg-clip-text text-transparent mb-4 font-poppins">Bienvenue sur Appyna</h1>
              <div className="h-1 w-24 bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] mx-auto mb-8"></div>
            </div>
            
            <div className="space-y-4 text-gray-700 font-montserrat">
              <p className="text-xl font-semibold">Votre compte a été activé avec succès.</p>
              <p className="text-lg leading-relaxed">
                Retournez maintenant sur Appyna pour accéder à votre compte.
              </p>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4 font-poppins">Erreur de confirmation</h1>
              <p className="text-lg text-gray-600 font-montserrat">
                Une erreur est survenue lors de la confirmation de votre email. Veuillez réessayer ou contacter le support.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
