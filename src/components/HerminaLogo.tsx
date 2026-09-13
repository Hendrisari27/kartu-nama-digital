import React from 'react';
import herminaLogo from '@/src/13.RSH ARCAMANIK.png';

interface HerminaLogoProps {
  className?: string;
  size?: number;
}

export const HerminaLogo: React.FC<HerminaLogoProps> = ({ className = '', size = 115 }) => {
  return (
    <div className={`flex flex-col select-none ${className}`}>
      <img
        src={herminaLogo}
        alt="Logo RS Hermina Arcamanik"
        style={{ height: size, width: 'auto' }}
        className="block object-contain max-w-full"
      />
    </div>
  );
};
