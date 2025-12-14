import React from 'react';
import Card from '../components/Card';

export default function Watchlist() {
  const watchlistedMovies = [];

  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-50 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-2">My Watchlist</h2>
        <p className="text-slate-400 mb-8">
          {watchlistedMovies.length} films watchlisted
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlistedMovies.map((movie, index) => (
            <Card 
              key={movie.id} 
              movie={movie} 
              showRating={true}
              index={index}
            />
          ))}
        </div>

        {watchlistedMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No films in your watchlist</p>
            <p className="text-slate-500 text-sm mt-2">Start adding to your watchlist to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}