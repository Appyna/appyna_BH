import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const returnPath = sessionStorage.getItem('return_path');

  const handleClick = (e: React.MouseEvent) => {
    const scrollPosition = sessionStorage.getItem('scroll_position');
    
    console.log('🔙 BackButton click:', {
      returnPath,
      scrollPosition,
      willNavigateTo: returnPath || 'navigate(-1)'
    });
  };

  // Si on a un returnPath, utiliser un Link, sinon un button avec navigate(-1)
  if (returnPath) {
    return (
      <Link
        to={returnPath}
        onClick={handleClick}
        className="fixed top-20 left-6 z-40 p-2 rounded-full bg-gray-500/20 hover:bg-gray-600/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 text-white/60 hover:text-white/80 hover:scale-105 inline-block"
        aria-label="Retour"
      >
        <ArrowLeftIcon />
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        console.log('⚠️ Pas de returnPath, navigation -1');
        navigate(-1);
      }}
      className="fixed top-20 left-6 z-40 p-2 rounded-full bg-gray-500/20 hover:bg-gray-600/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 text-white/60 hover:text-white/80 hover:scale-105"
      aria-label="Retour"
    >
      <ArrowLeftIcon />
    </button>
  );
};
