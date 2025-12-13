import React from 'react';
import Card from '../components/Card';

export default function MyMovies() {
  const ratedMovies = [
    { 
      id: 1,
      title: 'Inception', 
      rating: 9, 
      year: 2010,
      poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      director: 'Christopher Nolan'
    },
    { 
      id: 2,
      title: 'The Matrix', 
      rating: 10, 
      year: 1999,
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      director: 'Wachowski Sisters'
    },
    { 
      id: 3,
      title: 'Interstellar', 
      rating: 8, 
      year: 2014,
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      director: 'Christopher Nolan'
    },
    { 
      id: 4,
      title: 'Gladiator', 
      rating: 9, 
      year: 2000,
      poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      director: 'Ridley Scott'
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-50 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-2">My Films</h2>
        <p className="text-slate-400 mb-8">
          {ratedMovies.length} films watched
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {ratedMovies.map((movie, index) => (
            <Card 
              key={movie.id} 
              movie={movie} 
              showRating={true}
              index={index}
            />
          ))}
        </div>

        {ratedMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No films rated yet</p>
            <p className="text-slate-500 text-sm mt-2">Start adding movies to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}