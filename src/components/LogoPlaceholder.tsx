import React from 'react';

const LogoPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center text-center ${className}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className="w-12 h-12 text-primary"
    >
      <circle cx="50" cy="50" r="45" fill="hsl(var(--primary))" />
      <text x="50" y="60" fontSize="40" fill="hsl(var(--primary-foreground))" textAnchor="middle" fontWeight="bold">G</text>
    </svg>
    <p className="text-xs font-bold text-primary mt-1">Giorgio's Mar Azul</p>
    <p className="text-[8px] tracking-widest text-accent">RESTAURANTE</p>
  </div>
);

export default LogoPlaceholder;