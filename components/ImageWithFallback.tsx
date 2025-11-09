import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "/placeholder-image.svg"
}) => {
  // Déterminer si l'image source est valide
  const isValidSrc = src && src.trim() !== '' && src !== 'null' && src !== 'undefined';
  
  const [imgSrc, setImgSrc] = useState(isValidSrc ? src : fallbackSrc);
  const [hasError, setHasError] = useState(!isValidSrc);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    // Ne marquer comme réussi que si on charge une vraie image (pas le fallback)
    if (imgSrc !== fallbackSrc) {
      setHasError(false);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};
