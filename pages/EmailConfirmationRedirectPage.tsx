import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const EmailConfirmationRedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirmation de votre email en cours...');
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Détecter la plateforme
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isMobile = isIOS || isAndroid;
        
        if (isIOS) setPlatform('ios');
        else if (isAndroid) setPlatform('android');
        else setPlatform('desktop');

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

        // Si on est sur mobile, essayer d'ouvrir l'app avec plusieurs URL schemes
        if (isMobile) {
          setMessage('Ouverture de l\'application...');
          
          // Liste des URL schemes à essayer (du plus spécifique au plus générique)
          const schemes = [
            'appyna://',
            'com.appyna.app://',
            'com.appyna://',
            'appyna-app://'
          ];

          // Essayer d'ouvrir l'app avec le premier scheme
          let appOpened = false;
          const tryOpenApp = (schemeIndex: number) => {
            if (schemeIndex >= schemes.length) {
              // Tous les schemes ont échoué, rester sur le web
              setMessage('Email confirmé ! Veuillez rouvrir l\'application Appyna.');
              return;
            }

            const scheme = schemes[schemeIndex];
            const appUrl = `${scheme}auth/confirm?token=${token}`;
            
            console.log(`🔗 Tentative d'ouverture: ${appUrl}`);

            // Créer un iframe caché pour tenter d'ouvrir l'app
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = appUrl;
            document.body.appendChild(iframe);

            // Timer pour détecter si l'app s'est ouverte
            const startTime = Date.now();
            setTimeout(() => {
              const timeElapsed = Date.now() - startTime;
              // Si le timer s'exécute normalement (~1500ms), l'app ne s'est pas ouverte
              if (timeElapsed < 2000 && !appOpened) {
                document.body.removeChild(iframe);
                tryOpenApp(schemeIndex + 1); // Essayer le prochain scheme
              } else {
                // L'app s'est probablement ouverte
                appOpened = true;
                setMessage('Redirection vers l\'application...');
              }
            }, 1500);

            // Détecter si l'utilisateur quitte la page (= app ouverte)
            const handleVisibilityChange = () => {
              if (document.hidden) {
                appOpened = true;
                setMessage('Application ouverte avec succès !');
              }
            };
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Nettoyer après 3 secondes
            setTimeout(() => {
              document.removeEventListener('visibilitychange', handleVisibilityChange);
              if (!appOpened) {
                // Aucun scheme n'a fonctionné, afficher le message de fallback
                setMessage('Email confirmé ! Veuillez rouvrir l\'application Appyna.');
              }
            }, 3000);
          };

          // Démarrer les tentatives d'ouverture après un court délai
          setTimeout(() => tryOpenApp(0), 500);

        } else {
          // Sur desktop, afficher un message pour ouvrir l'app mobile
          setMessage('Email confirmé ! Veuillez vous connecter sur votre application mobile.');
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
            <p className="text-gray-600 mb-6">{message}</p>
            
            {platform === 'ios' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  📱 <strong>iOS détecté</strong><br/>
                  Si l'app ne s'ouvre pas automatiquement, fermez Safari et lancez l'app Appyna manuellement.
                </p>
              </div>
            )}
            
            {platform === 'android' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  📱 <strong>Android détecté</strong><br/>
                  Si l'app ne s'ouvre pas automatiquement, fermez le navigateur et lancez l'app Appyna manuellement.
                </p>
              </div>
            )}
            
            {platform === 'desktop' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  💻 <strong>Ordinateur détecté</strong><br/>
                  Ouvrez l'application Appyna sur votre téléphone pour vous connecter.
                </p>
              </div>
            )}
            
            <button
              onClick={() => {
                // Essayer de forcer l'ouverture de l'app une dernière fois
                if (platform !== 'desktop') {
                  window.location.href = 'appyna://';
                  setTimeout(() => {
                    alert('Si l\'application ne s\'ouvre pas, veuillez la lancer manuellement.');
                  }, 2000);
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {platform === 'desktop' ? 'Compris' : 'Ouvrir l\'application'}
            </button>
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
