import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  return (
    <div 
      className={`relative inline-block glitch-text-effect ${className}`} 
      data-text={text}
    >
      {text}
    </div>
  );
};
