import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => {
  return (
    <svg className={className} viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg" aria-label="Appyna">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" style={{ stopColor: '#7C3AED' }} />
          <stop offset="100%" style={{ stopColor: '#2DD4BF' }} />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="28"
        fontFamily="Poppins, sans-serif"
        fontSize="28"
        fontWeight="600"
        fill="url(#logoGradient)"
        letterSpacing="-1"
      >
        Appyna
      </text>
    </svg>
  );
};