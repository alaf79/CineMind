const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Cache storage
const cache = {
  upcoming: { data: null, timestamp: null },
  trending: { data: null, timestamp: null }
};

// Helper to check if cache is valid
const isCacheValid = (cacheEntry) => {
  if (!cacheEntry.data || !cacheEntry.timestamp) return false;
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

// Helper to format date
const formatReleaseDate = (dateString) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper to get notable works from known_for array
const getNotableWorks = (knownFor) => {
  if (!knownFor || knownFor.length === 0) return 'Various works';
  
  // Sort by popularity and get top 2
  const sortedWorks = knownFor
    .filter(work => work.title || work.name)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 2);
  
  if (sortedWorks.length === 0) return 'Various works';
  
  return sortedWorks
    .map(work => work.title || work.name)
    .join(', ');
};

export const tmdbService = {
  // Get upcoming movies (highly anticipated and popular)
  getUpcoming: async () => {
    // Check cache first
    if (isCacheValid(cache.upcoming)) {
      console.log('Using cached upcoming movies');
      return cache.upcoming.data;
    }

    try {
      console.log('Fetching upcoming movies from TMDB...');
      
      // Fetch multiple pages to get more options
      const [page1, page2] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=US`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=2&region=US`).then(r => r.json())
      ]);

      const allResults = [...page1.results, ...page2.results];
      
      // Filter for truly upcoming movies and sort by popularity
      const now = new Date();
      const upcomingOnly = allResults
        .filter(movie => {
          if (!movie.release_date) return false;
          const releaseDate = new Date(movie.release_date);
          // Only movies releasing within the next 6 months
          const sixMonthsFromNow = new Date();
          sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
          return releaseDate > now && releaseDate < sixMonthsFromNow;
        })
        .sort((a, b) => {
          // Sort by popularity (higher is better) and vote count
          const scoreA = (a.popularity || 0) * 0.7 + (a.vote_count || 0) * 0.3;
          const scoreB = (b.popularity || 0) * 0.7 + (b.vote_count || 0) * 0.3;
          return scoreB - scoreA;
        })
        .slice(0, 8); // Get top 8 popular upcoming movies
      
      // Get director info for each movie (with error handling)
      const moviesWithDetails = await Promise.allSettled(
        upcomingOnly.map(async (movie) => {
          let director = 'TBA';
          
          try {
            const creditsRes = await fetch(
              `${TMDB_BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`
            );
            
            if (creditsRes.ok) {
              const credits = await creditsRes.json();
              const directorObj = credits.crew?.find(person => person.job === 'Director');
              if (directorObj) {
                director = directorObj.name;
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch director for ${movie.title}`);
          }
          
          return {
            id: movie.id,
            title: movie.title,
            date: formatReleaseDate(movie.release_date),
            director: director,
            poster: movie.poster_path 
              ? `${TMDB_IMAGE_BASE}/original${movie.poster_path}` 
              : null,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            popularity: movie.popularity
          };
        })
      );

      // Extract successful results only
      const successfulMovies = moviesWithDetails
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .slice(0, 4);

      // Store in cache
      cache.upcoming = {
        data: successfulMovies,
        timestamp: Date.now()
      };

      return successfulMovies;
    } catch (error) {
      console.error('Failed to fetch upcoming movies:', error);
      
      // If we have stale cache data, return it as fallback
      if (cache.upcoming.data) {
        console.log('Using stale cache as fallback');
        return cache.upcoming.data;
      }
      
      return [];
    }
  },

  // Get trending people (actors/directors)
  getTrendingPeople: async () => {
    // Check cache first
    if (isCacheValid(cache.trending)) {
      console.log('Using cached trending people');
      return cache.trending.data;
    }

    try {
      console.log('Fetching trending people from TMDB...');
      const res = await fetch(
        `${TMDB_BASE_URL}/trending/person/week?api_key=${API_KEY}`
      );

      if (!res.ok) {
        throw new Error(`TMDB API error: ${res.status}`);
      }

      const data = await res.json();
      
      // Get detailed credits for each person
      const peopleWithCredits = await Promise.allSettled(
        data.results
          .filter(person => person.profile_path)
          .slice(0, 8) // Get 8 to have extras in case some fail
          .map(async (person) => {
            try {
              // Fetch their movie credits
              const creditsRes = await fetch(
                `${TMDB_BASE_URL}/person/${person.id}/movie_credits?api_key=${API_KEY}`
              );
              
              if (!creditsRes.ok) {
                throw new Error(`Failed to fetch credits for ${person.name}`);
              }
              
              const credits = await creditsRes.json();
              const castMovies = credits.cast || [];
              
              if (castMovies.length === 0) {
                return null;
              }
              
              // Sort by popularity to get top movies
              const sortedByPopularity = [...castMovies]
                .filter(movie => movie.title && movie.popularity)
                .sort((a, b) => b.popularity - a.popularity);
              
              // Sort by release date to get most recent
              const sortedByDate = [...castMovies]
                .filter(movie => movie.title && movie.release_date)
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
              
              // Get top 5 popular movies, then pick 2 randomly for variety
              const topPopular = sortedByPopularity.slice(0, 5);
              const selectedPopular = [];
              
              if (topPopular.length > 0) {
                // First popular movie
                selectedPopular.push(topPopular[0]);
                
                // Second popular movie (random from top 2-5)
                if (topPopular.length > 1) {
                  const randomIndex = Math.floor(Math.random() * Math.min(4, topPopular.length - 1)) + 1;
                  selectedPopular.push(topPopular[randomIndex]);
                }
              }
              
              // Get most recent movie
              const recentMovie = sortedByDate[0];
              
              // Combine: 2 popular + 1 recent (if recent isn't already in popular)
              const notableMovies = [...selectedPopular];
              if (recentMovie && !selectedPopular.find(m => m.id === recentMovie.id)) {
                notableMovies.push(recentMovie);
              }
              
              // Format notable works
              const notableWorks = notableMovies
                .slice(0, 2) // Show max 2 titles
                .map(movie => movie.title)
                .join(', ');
              
              return {
                id: person.id,
                name: person.name,
                role: person.known_for_department === 'Acting' ? 'Actor' : 'Director',
                notableWork: notableWorks || 'Various works',
                poster: `${TMDB_IMAGE_BASE}/w500${person.profile_path}`
              };
            } catch (err) {
              console.warn(`Failed to fetch credits for ${person.name}:`, err);
              return null;
            }
          })
      );
      
      // Extract successful results only
      const transformedData = peopleWithCredits
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value)
        .slice(0, 5);

      console.log('Transformed people data:', transformedData);

      // Store in cache
      cache.trending = {
        data: transformedData,
        timestamp: Date.now()
      };

      return transformedData;
    } catch (error) {
      console.error('Failed to fetch trending people:', error);
      
      // If we have stale cache data, return it as fallback
      if (cache.trending.data) {
        console.log('Using stale cache as fallback');
        return cache.trending.data;
      }
      
      return [];
    }
  },

  // Helper: Get image URL
  getImageUrl: (path, size = 'w500') => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  // Helper: Clear cache manually (useful for refresh functionality)
  clearCache: () => {
    cache.upcoming = { data: null, timestamp: null };
    cache.trending = { data: null, timestamp: null };
    console.log('Cache cleared');
  },

  // Helper: Get cache status (for debugging)
  getCacheStatus: () => {
    return {
      upcoming: {
        cached: !!cache.upcoming.data,
        valid: isCacheValid(cache.upcoming),
        age: cache.upcoming.timestamp 
          ? Math.floor((Date.now() - cache.upcoming.timestamp) / 1000) 
          : null
      },
      trending: {
        cached: !!cache.trending.data,
        valid: isCacheValid(cache.trending),
        age: cache.trending.timestamp 
          ? Math.floor((Date.now() - cache.trending.timestamp) / 1000) 
          : null
      }
    };
  }
};