import React, { useState } from 'react';
import { X, Search, Star } from 'lucide-react';

export default function AddMovies() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Mock search results
  const searchResults = searchQuery.length > 0 ? [
    { 
      id: 1, 
      title: 'Inception', 
      year: 2010,
      poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      director: 'Christopher Nolan'
    },
    { 
      id: 2, 
      title: 'Interstellar', 
      year: 2014,
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      director: 'Christopher Nolan'
    },
  ] : [];

  const handleAddMovie = () => {
    if (selectedMovie && rating > 0) {
      alert(`Added ${selectedMovie.title} with rating ${rating}/10`);
      setIsOpen(false);
      setSelectedMovie(null);
      setRating(0);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start px-6 py-6 space-y-6 w-full">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Add Movies</h2>
        <p className="text-gray-300 mb-8">
          Search for movies and add your ratings to get personalized recommendations
        </p>
        
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-white transition text-lg"
        >
          + Add a Film
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-white">Add a Film</h3>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setSelectedMovie(null);
                  setRating(0);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedMovie ? (
                <>
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for a movie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  {/* Search Results */}
                  <div className="space-y-3">
                    {searchResults.map((movie) => (
                      <div 
                        key={movie.id}
                        onClick={() => setSelectedMovie(movie)}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition"
                      >
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{movie.title}</h4>
                          <p className="text-gray-400 text-sm">{movie.year} · {movie.director}</p>
                        </div>
                      </div>
                    ))}
                    {searchQuery && searchResults.length === 0 && (
                      <p className="text-gray-400 text-center py-8">No results found</p>
                    )}
                    {!searchQuery && (
                      <p className="text-gray-400 text-center py-8">Start typing to search for movies</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Selected Movie */}
                  <div className="flex gap-6 mb-6">
                    <img 
                      src={selectedMovie.poster} 
                      alt={selectedMovie.title}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-xl mb-2">{selectedMovie.title}</h4>
                      <p className="text-gray-400 mb-4">{selectedMovie.year} · {selectedMovie.director}</p>
                      
                      <button
                        onClick={() => {
                          setSelectedMovie(null);
                          setRating(0);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        ← Choose a different film
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">Rate this film</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? 'fill-green-500 text-green-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-white font-bold text-xl">{rating}/10</span>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={handleAddMovie}
                    disabled={rating === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-semibold text-white transition"
                  >
                    Add to My Films
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="w-full max-w-4xl mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-white font-semibold mb-2">Search</h3>
            <p className="text-gray-400 text-sm">Find any movie from our extensive database</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-white font-semibold mb-2">Rate</h3>
            <p className="text-gray-400 text-sm">Give it a rating from 1 to 10 stars</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-white font-semibold mb-2">Discover</h3>
            <p className="text-gray-400 text-sm">Get personalized recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}