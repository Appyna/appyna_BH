import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Si on est dans une conversation individuelle (/messages/:id), retourner vers /messages
    if (location.pathname.startsWith('/messages/')) {
      navigate('/messages');
      return;
    }
    
    // Si on est sur la page messagerie principale (/messages), retourner vers l'accueil
    if (location.pathname === '/messages') {
      navigate('/');
      return;
    }
    
    const returnPath = sessionStorage.getItem('return_path');
    
    // Pages avec comportement spécifique de retour
    const specificRoutes: { [key: string]: string } = {
      '/favorites': '/',
      '/settings': '/',
      '/boost-history': '/',
    };
    
    // Si on est sur une page avec un retour spécifique défini
    for (const [route, destination] of Object.entries(specificRoutes)) {
      if (location.pathname === route) {
        // Ne pas nettoyer return_path ici - le ScrollManager en a besoin
        navigate(destination);
        return;
      }
    }
    
    // Si on est sur un profil, retourner vers l'accueil (sauf si returnPath valide)
    if (location.pathname.startsWith('/profile/')) {
      // Vérifier si returnPath est valide (pas la page actuelle, pas /favorites bloqué)
      if (returnPath && returnPath !== location.pathname && returnPath !== '/favorites') {
        // Ne pas nettoyer - ScrollManager le fera après restauration
        navigate(returnPath);
        return;
      }
      // Sinon retour accueil par défaut
      navigate('/');
      return;
    }
    
    // Si returnPath existe et est valide, naviguer vers cette page
    if (returnPath && returnPath !== location.pathname) {
      // Ne pas nettoyer - ScrollManager le fera après restauration du scroll
      navigate(returnPath);
    } else {
      // Fallback : retour arrière classique
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="absolute top-4 left-4 z-30 p-2 rounded-full bg-gray-500/20 hover:bg-gray-600/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 text-white/60 hover:text-white/80 hover:scale-105"
      aria-label="Retour"
    >
      <ArrowLeftIcon />
    </button>
  );
};
