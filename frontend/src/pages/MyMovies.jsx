import React, { useState } from 'react';
import { Star, Calendar, Clock } from 'lucide-react';

export default function MyMovies() {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  
  // Placeholder list with poster URLs
  const ratedMovies = [
    { 
      id: 1,
      title: 'Inception', 
      rating: 9, 
      year: 2010,
      poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      director: 'Christopher Nolan',
      runtime: '148 min'
    },
    { 
      id: 2,
      title: 'The Matrix', 
      rating: 10, 
      year: 1999,
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      director: 'Wachowski Sisters',
      runtime: '136 min'
    },
    { 
      id: 3,
      title: 'Interstellar', 
      rating: 8, 
      year: 2014,
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      director: 'Christopher Nolan',
      runtime: '169 min'
    },
    { 
      id: 4,
      title: 'Gladiator', 
      rating: 9, 
      year: 2000,
      poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      director: 'Ridley Scott',
      runtime: '155 min'
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-green-500 text-green-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-3 h-3 fill-green-500 text-green-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center justify-start px-6 py-6 space-y-6 w-full">
      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-white mb-2">My Films</h2>
        <p className="text-gray-400 mb-8">
          {ratedMovies.length} films watched
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {ratedMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(movie.rating)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Calendar className="w-3 h-3" />
                      <span>{movie.year}</span>
                    </div>
                  </div>
                </div>

                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {movie.rating}
                </div>
              </div>

              {/* Title below poster (visible on mobile) */}
              <div className="mt-2 md:hidden">
                <h3 className="text-white text-sm font-medium line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(movie.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {ratedMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No films rated yet</p>
            <p className="text-gray-500 text-sm mt-2">Start adding movies to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}