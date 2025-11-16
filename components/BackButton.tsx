import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    const returnPath = sessionStorage.getItem('return_path');
    const scrollPosition = sessionStorage.getItem('scroll_position');
    
    console.log('🔙 BackButton click:', {
      returnPath,
      scrollPosition
    });
    
    // CORRECTION: Si returnPath est /favorites, toujours y retourner directement
    if (returnPath === '/favorites') {
      console.log('✅ Retour forcé vers Mes Favoris');
      navigate('/favorites');
    } else if (returnPath) {
      // Pour les autres pages (accueil avec filtres, profil), naviguer vers returnPath
      console.log('✅ Navigation directe vers:', returnPath);
      navigate(returnPath);
    } else {
      // Fallback si pas de returnPath
      console.log('⚠️ Pas de returnPath, navigate(-1)');
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
