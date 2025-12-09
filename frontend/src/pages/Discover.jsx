import React, { useState } from 'react';
import { Star, Info, Plus } from 'lucide-react';

export default function Discover() {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  
  const recommendations = [
    { 
      id: 1,
      title: 'The Shawshank Redemption', 
      year: 1994,
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      director: 'Frank Darabont',
      rating: 9.3,
      genres: ['Drama', 'Crime']
    },
    { 
      id: 2,
      title: 'The Dark Knight', 
      year: 2008,
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      director: 'Christopher Nolan',
      rating: 9.0,
      genres: ['Action', 'Crime', 'Drama']
    },
    { 
      id: 3,
      title: 'Pulp Fiction', 
      year: 1994,
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      director: 'Quentin Tarantino',
      rating: 8.9,
      genres: ['Crime', 'Drama']
    },
    { 
      id: 4,
      title: 'Forrest Gump', 
      year: 1994,
      poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      director: 'Robert Zemeckis',
      rating: 8.8,
      genres: ['Drama', 'Romance']
    },
    { 
      id: 5,
      title: 'Fight Club', 
      year: 1999,
      poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      director: 'David Fincher',
      rating: 8.8,
      genres: ['Drama']
    },
    { 
      id: 6,
      title: 'The Godfather', 
      year: 1972,
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      director: 'Francis Ford Coppola',
      rating: 9.2,
      genres: ['Crime', 'Drama']
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center justify-start px-6 py-6 space-y-6 w-full">
      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-white mb-2">Recommended For You</h2>
        <p className="text-gray-400 mb-8">
          Based on your taste and ratings
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recommendations.map((movie) => (
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
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                    {/* Top actions */}
                    <div className="flex justify-end gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom info */}
                    <div>
                      <h3 className="font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                      <p className="text-xs text-gray-300 mb-2">{movie.year} · {movie.director}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(movie.rating)}
                        <span className="text-xs text-gray-300 ml-1">{movie.rating}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre, idx) => (
                          <span key={idx} className="text-xs bg-gray-800/80 px-2 py-0.5 rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title below poster (visible on mobile) */}
              <div className="mt-2 md:hidden">
                <h3 className="text-white text-sm font-medium line-clamp-1">{movie.title}</h3>
                <p className="text-gray-400 text-xs">{movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}