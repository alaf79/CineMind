import { authUtils } from '../utils/authUtils.js';

// frontend/src/api/movieApi.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  const token = authUtils.getToken();
  console.log('Token found:', token ? `Yes (${token.substring(0,20)}...)` : 'NO');
  return token;
};

// Helper to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    console.error('❌ No token found in storage');
    throw new Error('Not authenticated. Please log in.');
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  console.log('📡 Making request to:', url);
  const response = await fetch(url, config);
  
  if (response.status === 401) {
    console.error('❌ 401 Unauthorized - Token may be invalid or expired');
    throw new Error('Session expired. Please log in again.');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error('❌ Request failed:', error);
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  console.log('✅ Request successful');
  return response.json();
};

export const movieApi = {
  // Add movie to user's library
  addMovie: async (movieId, rating, watchedDate = new Date()) => {
    return fetchWithAuth(`${API_BASE_URL}/api/movies/add`, {
      method: 'POST',
      body: JSON.stringify({
        movie_id: movieId,
        rating: rating,
        watched_date: watchedDate
      }),
    });
  },

  // Get user's movie library
  getLibrary: async () => {
    return fetchWithAuth(`${API_BASE_URL}/api/movies/library`);
  },

  // Update movie rating
  updateRating: async (movieId, rating) => {
    return fetchWithAuth(`${API_BASE_URL}/api/movies/${movieId}/rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating }),
    });
  },

  // Delete movie from library (you'll need to add this endpoint to backend)
  deleteMovie: async (movieId) => {
    return fetchWithAuth(`${API_BASE_URL}/api/movies/${movieId}`, {
      method: 'DELETE',
    });
  },
};