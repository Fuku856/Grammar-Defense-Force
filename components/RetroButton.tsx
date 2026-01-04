import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'green' | 'pink' | 'cyan' | 'red';
  label: string;
  subLabel?: string;
}

const colorClasses = {
  green: 'border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black',
  pink: 'border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black',
  cyan: 'border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black',
  red: 'border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-black',
};

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  color = 'green', 
  label, 
  subLabel, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`
        relative group border-2 md:border-4 px-2 py-2 md:py-4 
        font-bold uppercase transition-all duration-75 active:translate-y-1
        flex flex-col items-center justify-center leading-none
        ${colorClasses[color]}
        ${className}
      `}
      {...props}
    >
      <span className="text-sm md:text-xl block">{label}</span>
      {subLabel && (
        <span className="text-[10px] md:text-xs block mt-1 opacity-90 group-hover:text-black">
          {subLabel}
        </span>
      )}
      
      {/* Corner pixels for rounded look */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-black -translate-x-0.5 -translate-y-0.5" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-black translate-x-0.5 -translate-y-0.5" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-black -translate-x-0.5 translate-y-0.5" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-black translate-x-0.5 translate-y-0.5" />
    </button>
  );
};