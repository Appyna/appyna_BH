import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  /**
   * Format de la publicité :
   * - horizontal: Bannière horizontale (728x90 desktop, 320x50 mobile)
   * - vertical: Rectangle vertical (300x600)
   * - square: Rectangle moyen (300x250)
   */
  format: 'horizontal' | 'vertical' | 'square';
  
  /**
   * Slot ID de Google AdSense (à configurer dans votre compte AdSense)
   * Format: "1234567890"
   */
  adSlot?: string;
  
  /**
   * Classes CSS personnalisées
   */
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  format, 
  adSlot = 'XXXXXXX', // Remplacer par votre slot ID
  className = '' 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger les pubs Google AdSense
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la publicité:', error);
    }
  }, []);

  // Styles selon le format
  const getAdStyles = () => {
    switch (format) {
      case 'horizontal':
        return {
          desktop: 'min-h-[90px] max-w-[728px]',
          mobile: 'min-h-[50px] max-w-[320px]',
          dataFormat: 'auto',
          dataFullWidth: true
        };
      case 'vertical':
        return {
          desktop: 'min-h-[600px] max-w-[300px]',
          mobile: 'min-h-[250px] max-w-[300px]',
          dataFormat: 'rectangle',
          dataFullWidth: false
        };
      case 'square':
        return {
          desktop: 'min-h-[250px] max-w-[300px]',
          mobile: 'min-h-[250px] max-w-[300px]',
          dataFormat: 'rectangle',
          dataFullWidth: false
        };
    }
  };

  const styles = getAdStyles();

  return (
    <div 
      ref={adRef}
      className={`ad-container flex justify-center items-center my-4 ${className}`}
    >
      {/* Placeholder visible en développement */}
      {process.env.NODE_ENV === 'development' ? (
        <div 
          className={`border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 font-medium ${
            format === 'horizontal' 
              ? 'w-full max-w-[728px] h-[90px] md:h-[90px] h-[50px]' 
              : format === 'vertical'
              ? 'w-[300px] h-[600px] md:h-[600px] h-[250px]'
              : 'w-[300px] h-[250px]'
          }`}
        >
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-xs">Publicité Google</p>
            <p className="text-xs">Format: {format}</p>
          </div>
        </div>
      ) : (
        /* Vrai bloc AdSense en production */
        <ins
          className={`adsbygoogle ${styles.desktop} md:${styles.desktop} ${styles.mobile}`}
          style={{ 
            display: 'block',
            textAlign: 'center'
          }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // À REMPLACER par votre Publisher ID
          data-ad-slot={adSlot}
          data-ad-format={styles.dataFormat}
          data-full-width-responsive={styles.dataFullWidth.toString()}
        />
      )}
    </div>
  );
};
