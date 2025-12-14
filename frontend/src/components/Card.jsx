// frontend/src/components/Card.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getMovieUrl, getPersonUrl } from '../utils/urlUtils';

export default function Card({ movie, onClick, showRating = false, index = 0, isPerson = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Handle both movie and person data structures
  const title = movie.title || movie.name;
  const poster = movie.poster || movie.image;
  const year = movie.year;
  const director = movie.director || movie.notableWork;
  const role = movie.role;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;
    
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`w-3 h-3 ${
              i < fullStars 
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalfStar
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (isPerson) {
      navigate(getPersonUrl(movie.id, title));
    } else {
      navigate(getMovieUrl(movie.id, title));
    }
  };

  const handleDirectorClick = (e) => {
    e.stopPropagation();
    // Navigate to director page if we have the director ID
    if (movie.directorId) {
      navigate(getPersonUrl(movie.directorId, director));
    }
  };

  return (
    <div 
      className="group cursor-pointer movie-card"
      style={{
        animationDelay: `${index * 50}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className={`relative ${isPerson ? 'aspect-[3/4]' : 'aspect-[2/3]'} rounded overflow-hidden bg-slate-900 ring-1 ring-slate-700 hover:ring-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group-hover:scale-[1.03] group-active:scale-[0.98]`}>
        <img 
          src={poster} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent animate-fade-in">
            <div className="absolute inset-0 p-3 flex flex-col justify-end">
              {isPerson && role && (
                <span className="inline-block px-2 py-1 bg-purple-500/80 text-white text-xs rounded-full mb-2 w-fit">
                  {role}
                </span>
              )}
              <h3 className="font-semibold text-sm text-slate-50 mb-1 line-clamp-2">
                {title}
              </h3>
              <p className="text-xs text-slate-300 mb-2">
                {isPerson ? (
                  director
                ) : (
                  <>
                    {year} · 
                    {movie.directorId ? (
                      <button
                        onClick={handleDirectorClick}
                        className="hover:text-purple-400 transition hover:underline ml-1"
                      >
                        {director}
                      </button>
                    ) : (
                      <span className="ml-1">{director}</span>
                    )}
                  </>
                )}
              </p>
              {showRating && movie.rating && (
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(movie.rating)}
                  <span className="text-xs text-slate-300 ml-1">{movie.rating}</span>
                </div>
              )}
              {movie.genres && (
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .movie-card {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}