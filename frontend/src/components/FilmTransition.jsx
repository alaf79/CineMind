import React, { useState, useEffect } from 'react';

// Film strip row component
const FilmStripRow = ({ delay, index }) => {
  // Varying colors for each strip
  const colors = [
    'from-slate-800 via-slate-700 to-slate-800',
    'from-slate-800 via-slate-600 to-slate-800',
    'from-gray-800 via-gray-700 to-gray-800',
    'from-slate-700 via-slate-600 to-slate-700',
    'from-gray-800 via-slate-700 to-gray-800',
  ];
  
  // Random sepia/blue tints
  const tints = [
    'bg-orange-500/5',
    'bg-blue-500/5',
    'bg-green-500/5',
    'bg-amber-500/5',
    'bg-cyan-500/5',
  ];
  
  const colorClass = colors[index % colors.length];
  const tintClass = tints[index % tints.length];
  
  return (
    <div 
      className="film-strip-row"
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      {/* Light leak effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent opacity-0 light-leak" />
      
      {/* Color tint overlay */}
      <div className={`absolute inset-0 ${tintClass}`} />
      
      {/* Film holes on top */}
      <div className="flex absolute top-0 left-0 right-0 h-3 gap-4 bg-slate-900 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div 
            key={`top-${i}`} 
            className="w-2 h-2 bg-slate-950 rounded-full mt-0.5 flex-shrink-0 film-hole"
          />
        ))}
      </div>
      
      {/* Main film strip area with grain */}
      <div className={`absolute inset-0 top-3 bottom-3 bg-gradient-to-r ${colorClass}`}>
        <div className="absolute inset-0 film-grain opacity-20" />
        
        {/* Film scratches */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="film-scratch" style={{ left: `${20 + index * 15}%` }} />
          <div className="film-scratch" style={{ left: `${60 + index * 10}%` }} />
        </div>
        
        {/* Vignette */}
        <div className="absolute inset-0 vignette" />
      </div>
      
      {/* Film holes on bottom */}
      <div className="flex absolute bottom-0 left-0 right-0 h-3 gap-4 bg-slate-900 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div 
            key={`bottom-${i}`} 
            className="w-2 h-2 bg-slate-950 rounded-full mt-0.5 flex-shrink-0 film-hole"
          />
        ))}
      </div>
    </div>
  );
};

// Main transition component
export default function FilmTransition({ onComplete }) {
  const [phase, setPhase] = useState('animating');
  
  const rows = 7;
  const delays = React.useMemo(() => {
    const baseDelays = Array.from({ length: rows }, (_, i) => i * 60);
    return baseDelays.sort(() => Math.random() - 0.5);
  }, []);

  const maxDelay = Math.max(...delays);

  useEffect(() => {
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      if (onComplete) onComplete();
    }, maxDelay + 2300);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete, maxDelay]);

  if (phase === 'complete') return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes slideFilmStrip {
          0% {
            transform: translateX(100%);
            filter: blur(0px);
          }
          15% {
            filter: blur(1.5px);
          }
          35% {
            transform: translateX(0%);
            filter: blur(0px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8);
          }
          60% {
            transform: translateX(0%);
            filter: blur(0px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8);
          }
          75% {
            filter: blur(1.5px);
          }
          100% {
            transform: translateX(-100%);
            filter: blur(0px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          }
        }

        @keyframes lightLeakSweep {
          0%, 30% {
            opacity: 0;
          }
          35%, 60% {
            opacity: 1;
          }
          65%, 100% {
            opacity: 0;
          }
        }

        @keyframes holeGlow {
          0%, 30% {
            box-shadow: none;
          }
          35%, 60% {
            box-shadow: 0 0 4px rgba(251, 191, 36, 0.4), 0 0 8px rgba(251, 191, 36, 0.2);
          }
          65%, 100% {
            box-shadow: none;
          }
        }

        .film-strip-row {
          position: absolute;
          left: 0;
          right: 0;
          height: calc(100% / 7);
          transform: translateX(100%);
          animation: slideFilmStrip 2.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          will-change: transform;
        }

        .light-leak {
          animation: lightLeakSweep 2.1s ease-in-out forwards;
          animation-delay: inherit;
        }

        .film-hole {
          animation: holeGlow 2.1s ease-in-out forwards;
          animation-delay: inherit;
        }

        .film-grain {
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.12) 2px, rgba(0,0,0,.12) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.12) 2px, rgba(0,0,0,.12) 4px);
          animation: grainShift 0.08s steps(1) infinite;
        }

        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          10% { transform: translate(-1px, 1px); opacity: 0.25; }
          20% { transform: translate(1px, -1px); opacity: 0.18; }
          30% { transform: translate(-1px, -1px); opacity: 0.22; }
          40% { transform: translate(1px, 1px); opacity: 0.2; }
          50% { transform: translate(-1px, 0); opacity: 0.24; }
          60% { transform: translate(1px, 0); opacity: 0.19; }
          70% { transform: translate(0, -1px); opacity: 0.21; }
          80% { transform: translate(0, 1px); opacity: 0.23; }
          90% { transform: translate(-1px, 1px); opacity: 0.2; }
        }

        .film-scratch {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(255, 255, 255, 0.1) 10%,
            rgba(255, 255, 255, 0.15) 20%,
            transparent 30%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 70%,
            rgba(255, 255, 255, 0.12) 85%,
            transparent 100%
          );
          opacity: 0.4;
          animation: scratchFlicker 0.2s steps(2) infinite;
        }

        @keyframes scratchFlicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .vignette {
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%);
          pointer-events: none;
        }

        .film-strip-row:nth-child(1) { top: 0; }
        .film-strip-row:nth-child(2) { top: calc(100% / 7); }
        .film-strip-row:nth-child(3) { top: calc(200% / 7); }
        .film-strip-row:nth-child(4) { top: calc(300% / 7); }
        .film-strip-row:nth-child(5) { top: calc(400% / 7); }
        .film-strip-row:nth-child(6) { top: calc(500% / 7); }
        .film-strip-row:nth-child(7) { top: calc(600% / 7); }
      `}</style>
      
      {delays.map((delay, i) => (
        <FilmStripRow key={i} delay={delay} index={i} />
      ))}
    </div>
  );
}