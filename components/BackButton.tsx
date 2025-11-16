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
    // Récupérer la page de retour depuis sessionStorage
    const returnPath = sessionStorage.getItem('return_path');
    const scrollPosition = sessionStorage.getItem('scroll_position');
    
    console.log('🔙 BackButton click:', {
      returnPath,
      scrollPosition,
      currentPath: location.pathname,
      allSessionStorage: {
        scroll_position: sessionStorage.getItem('scroll_position'),
        return_path: sessionStorage.getItem('return_path'),
        on_favorites_page: sessionStorage.getItem('on_favorites_page'),
        on_profile_page: sessionStorage.getItem('on_profile_page')
      }
    });
    
    if (returnPath) {
      console.log('✅ Navigation vers:', returnPath);
      
      // Utiliser window.history pour forcer une vraie navigation sans passer par /
      // On garde les données en sessionStorage pour la restauration
      window.history.pushState(null, '', returnPath);
      
      // Puis forcer React Router à détecter le changement
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Fallback : historique du navigateur via React Router
      console.log('⚠️ Pas de returnPath, navigation -1');
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="fixed top-20 left-6 z-40 p-2 rounded-full bg-gray-500/20 hover:bg-gray-600/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 text-white/60 hover:text-white/80 hover:scale-105"
      aria-label="Retour"
    >
      <ArrowLeftIcon />
    </button>
  );
};
