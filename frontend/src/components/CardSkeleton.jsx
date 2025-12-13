import React from 'react';

export default function CardSkeleton({ isPerson = false }) {
  return (
    <div 
      className={`relative ${isPerson ? 'aspect-[3/4]' : 'aspect-[2/3]'} rounded overflow-hidden bg-slate-900 ring-1 ring-slate-700`}
    >
      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-700/20 to-transparent"></div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}