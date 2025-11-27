import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const EmailConfirmationRedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirmation de votre email en cours...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Récupérer le token de confirmation depuis l'URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || type !== 'signup') {
          setStatus('error');
          setMessage('Lien de confirmation invalide');
          return;
        }

        // Vérifier la session (Supabase gère automatiquement la confirmation via le token dans l'URL)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur confirmation:', error);
          setStatus('error');
          setMessage('Erreur lors de la confirmation. Veuillez réessayer.');
          return;
        }

        // Succès !
        setStatus('success');
        setMessage('Email confirmé avec succès ! Redirection...');

        // Essayer de détecter si on est dans l'app (WebView) ou un navigateur externe
        const isInApp = window.navigator.userAgent.includes('wv') || // WebView Android
                        window.navigator.userAgent.includes('WebView') || // WebView générique
                        !(window.navigator.userAgent.includes('Safari') && !window.navigator.userAgent.includes('Chrome')); // Pas Safari standalone

        if (isInApp) {
          // Dans l'app : redirection simple
          setTimeout(() => navigate('/'), 2000);
        } else {
          // Dans un navigateur externe : tenter d'ouvrir l'app avec un deep link
          setTimeout(() => {
            // Essayer d'ouvrir l'app (change "appyna" par le scheme de ton app si tu en as un)
            const appScheme = 'appyna://'; // Ou juste rediriger vers ton site
            const fallbackUrl = 'https://appyna-bh.vercel.app/';
            
            // Tenter d'ouvrir l'app
            window.location.href = fallbackUrl; // Ou appScheme si configuré
            
            // Message pour l'utilisateur
            setMessage('Veuillez rouvrir l\'application Appyna pour continuer.');
          }, 2000);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setStatus('error');
        setMessage('Une erreur est survenue.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmation en cours</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email confirmé !</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Aller à la connexion
            </button>
          </>
        )}
      </div>
    </div>
  );
};
