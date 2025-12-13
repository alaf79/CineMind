import React, { useState, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import { authUtils } from "../utils/authUtils";
import Card from "../components/Card";

export default function Profile() {
  const [isPickingShowcase, setIsPickingShowcase] = useState(false);
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showcase, setShowcase] = useState(() => {
    // Initialize from localStorage immediately
    try {
      const stored = localStorage.getItem('profileShowcase');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load showcase:', e);
    }
    return [null, null, null, null];
  });
  const [username, setUsername] = useState(authUtils.getUsername() || "Guest");

  // Load username on mount
  useEffect(() => {
    const storedUsername = authUtils.getUsername();
    if (storedUsername) setUsername(storedUsername);
  }, []);

  // Save showcase to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('profileShowcase', JSON.stringify(showcase));
    } catch (e) {
      console.error('Failed to save showcase:', e);
    }
  }, [showcase]);

  const user = {
    name: username,
    bio: "Film enthusiast and Christopher Nolan superfan. Love sci-fi, thrillers, and anything that makes me think.",
    favoriteGenres: ["Sci-Fi", "Thriller", "Drama"],
    profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&size=200&background=1f2937&color=d4af37`,
    headerImage: "https://image.tmdb.org/t/p/original/jOzrELAzFxtMx2I4uDGHOotdfsS.jpg",
  };

  const stats = {
    filmsWatched: 247,
    thisYear: 68,
    avgRating: 7.8,
    favoriteDirector: "Christopher Nolan",
  };

  const allMovies = [
    { id: 1, title: "Inception", year: 2010, poster: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg", director: "Christopher Nolan", rating: 9 },
    { id: 2, title: "Interstellar", year: 2014, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", director: "Christopher Nolan", rating: 10 },
    { id: 3, title: "The Dark Knight", year: 2008, poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", director: "Christopher Nolan", rating: 9 },
    { id: 4, title: "The Matrix", year: 1999, poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", director: "Wachowski Sisters", rating: 10 },
    { id: 5, title: "Pulp Fiction", year: 1994, poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", director: "Quentin Tarantino", rating: 9 },
    { id: 6, title: "The Shawshank Redemption", year: 1994, poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", director: "Frank Darabont", rating: 9.3 },
    { id: 7, title: "Forrest Gump", year: 1994, poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", director: "Robert Zemeckis", rating: 8.8 },
    { id: 8, title: "Fight Club", year: 1999, poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", director: "David Fincher", rating: 8.8 },
  ];

  // Get movies already in showcase
  const showcaseMovieIds = showcase.filter(m => m !== null).map(m => m.id);

  // Filter out movies already in showcase
  const availableMovies = allMovies.filter(movie => !showcaseMovieIds.includes(movie.id));

  const searchResults = searchQuery.length
    ? availableMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleOpenModal = (index) => {
    setCurrentShowcaseIndex(index);
    setIsPickingShowcase(true);
    setSearchQuery("");
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsPickingShowcase(false);
      setIsModalClosing(false);
      setCurrentShowcaseIndex(null);
      setSearchQuery("");
    }, 200);
  };

  const handleAddToShowcase = (movie) => {
    const newShowcase = [...showcase];
    newShowcase[currentShowcaseIndex] = movie;
    setShowcase(newShowcase);
    handleCloseModal();
  };

  const handleRemoveFromShowcase = (index) => {
    const newShowcase = [...showcase];
    newShowcase[index] = null;
    setShowcase(newShowcase);
  };

  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-50 min-h-screen">
      {/* Header */}
      <div className="w-full h-32 sm:h-40 md:h-48 overflow-hidden relative">
        <img src={user.headerImage} alt="Header" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 to-slate-950"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col gap-4">
          {/* Profile Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <img src={user.profilePicture} alt={user.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg ring-2 ring-purple-500/30" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-center md:text-left">{user.name}</h1>
            <p className="text-slate-300 text-sm sm:text-base line-clamp-4 text-center md:text-left">{user.bio}</p>
            <div className="flex flex-wrap gap-1 justify-center md:justify-start">
              {user.favoriteGenres.map((genre) => (
                <span key={genre} className="px-2 py-0.5 text-xs sm:text-sm border border-purple-500/30 rounded text-purple-300">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 mt-2">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="border border-slate-800 rounded p-3 hover:border-purple-500/30 transition">
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className={`text-xl font-bold ${key === "thisYear" ? "text-purple-400" : "text-cyan-400"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Showcase */}
        <div className="w-full flex justify-center mt-4 md:mt-0">
          <div className="grid grid-cols-2 gap-6 sm:gap-6 md:gap-8 max-w-[500px] justify-items-center">
            {showcase.map((movie, idx) => (
              <div key={idx} className="relative group w-[160px] sm:w-[180px] md:w-[200px] aspect-[2/3] flex-shrink-0">
                {movie ? (
                  <>
                    <Card movie={movie} showRating={true} index={idx} />
                    <button
                      onClick={() => handleRemoveFromShowcase(idx)}
                      className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:scale-110 active:scale-90 z-10"
                    >
                      <X className="w-5 h-5 text-slate-300" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenModal(idx)}
                    className="w-full h-full rounded border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 bg-slate-900/30 hover:bg-slate-900/50 flex items-center justify-center text-purple-400/70 text-4xl sm:text-5xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-12 h-12 sm:w-16 sm:h-16" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Showcase Picker Modal */}
      {isPickingShowcase && (
        <div className={`fixed inset-0 flex items-start justify-center z-50 px-4 pt-16 modal-overlay ${isModalClosing ? 'modal-closing' : 'modal-opening'}`}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className={`bg-slate-900 rounded-lg border border-slate-800 w-full max-w-2xl p-4 relative z-10 modal-content ${isModalClosing ? 'modal-content-closing' : 'modal-content-opening'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-50">Choose a Film for Showcase</h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-200 transition hover:scale-110 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for a movie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-slate-700 transition-all"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="space-y-1 max-h-96 overflow-y-auto overflow-x-hidden">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleAddToShowcase(movie)}
                  className="flex items-center gap-3 p-2 rounded border border-slate-800 hover:border-purple-400/50 hover:bg-slate-800/50 cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-slate-700 rounded flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-50 text-sm truncate">{movie.title}</h4>
                    <p className="text-xs text-slate-400">{movie.year} · {movie.director}</p>
                  </div>
                </div>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-slate-400 text-center py-4 text-sm">
                  {availableMovies.length === 0 ? "All movies are already in your showcase" : "No results found"}
                </p>
              )}
              {!searchQuery && (
                <p className="text-slate-400 text-center py-4 text-sm">Start typing to search for movies</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalOverlayIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalOverlayOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes modalContentIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalContentOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
        }

        .modal-opening {
          animation: modalOverlayIn 0.25s ease-out forwards;
        }

        .modal-closing {
          animation: modalOverlayOut 0.2s ease-in forwards;
        }

        .modal-content-opening {
          animation: modalContentIn 0.25s ease-out forwards;
        }

        .modal-content-closing {
          animation: modalContentOut 0.2s ease-in forwards;
        }
      `}</style>
    </div>
  );
}