import React from 'react';
import { Film, Star, TrendingUp, Calendar, Award, Heart } from 'lucide-react';

export default function Profile() {
  const user = {
    name: 'John Doe',
    username: '@johndoe',
    joinDate: 'January 2024',
    bio: 'Film enthusiast and Christopher Nolan superfan. Love sci-fi, thrillers, and anything that makes me think.',
    favoriteGenres: ['Sci-Fi', 'Thriller', 'Drama'],
    profilePicture: 'https://ui-avatars.com/api/?name=John+Doe&size=200&background=3b82f6&color=fff',
    headerImage: 'https://image.tmdb.org/t/p/original/jOzrELAzFxtMx2I4uDGHOotdfsS.jpg', // Interstellar backdrop
  };

  const stats = {
    filmsWatched: 247,
    thisYear: 68,
    ratings: 189,
    avgRating: 7.8,
    topGenre: 'Sci-Fi',
    favoriteYear: 2014,
  };

  const recentActivity = [
    { 
      id: 1,
      title: 'Oppenheimer', 
      rating: 9,
      poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      date: '2 days ago'
    },
    { 
      id: 2,
      title: 'Dune: Part Two', 
      rating: 10,
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      date: '5 days ago'
    },
    { 
      id: 3,
      title: 'The Dark Knight', 
      rating: 10,
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      date: '1 week ago'
    },
    { 
      id: 4,
      title: 'Inception', 
      rating: 9,
      poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      date: '2 weeks ago'
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-y-auto scrollbar-hide">
      {/* Header with backdrop */}
      <div className="w-full relative">
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img 
            src={user.headerImage} 
            alt="Header"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6 ">
            {/* Profile Picture */}
            <img 
              src={user.profilePicture} 
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-xl"
            />
            
            {/* Name and Bio */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-gray-400 text-lg mb-3">{user.username}</p>
              <p className="text-gray-300 max-w-2xl">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-7xl px-6 py-8 ">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-center">
            <Film className="w-8 h-8 mx-auto mb-2 text-white" />
            <div className="text-3xl font-bold text-white mb-1">{stats.filmsWatched}</div>
            <div className="text-blue-100 text-sm">Films</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-white" />
            <div className="text-3xl font-bold text-white mb-1">{stats.thisYear}</div>
            <div className="text-green-100 text-sm">This Year</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-white" />
            <div className="text-3xl font-bold text-white mb-1">{stats.ratings}</div>
            <div className="text-yellow-100 text-sm">Ratings</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-white" />
            <div className="text-3xl font-bold text-white mb-1">{stats.avgRating}</div>
            <div className="text-purple-100 text-sm">Avg Rating</div>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-white" />
            <div className="text-3xl font-bold text-white mb-1">{stats.topGenre}</div>
            <div className="text-pink-100 text-sm">Top Genre</div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-white" />
            <div className="text-3xl font-bold text-white mb-1">{stats.favoriteYear}</div>
            <div className="text-red-100 text-sm">Fav Year</div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Member Since */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Member Since
            </h3>
            <p className="text-gray-300">{user.joinDate}</p>
          </div>

          {/* Favorite Genres */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Favorite Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.favoriteGenres.map((genre, idx) => (
                <span 
                  key={idx} 
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Watching Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Activity
            </h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">• {stats.thisYear} films this year</p>
              <p className="text-sm">• {Math.round(stats.thisYear / 12)} films per month</p>
              <p className="text-sm">• {stats.ratings} ratings given</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold text-xl mb-4">Recent Activity</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentActivity.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-2">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {movie.rating}
                  </div>
                </div>
                <h4 className="text-white text-sm font-medium line-clamp-1 mb-1">{movie.title}</h4>
                <p className="text-gray-400 text-xs">{movie.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}