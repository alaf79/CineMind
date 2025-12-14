import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { authUtils } from './utils/authUtils';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Discover from './pages/Discover';
import AddMovies from './pages/AddMovies';
import MyMovies from './pages/MyMovies';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MovieDetails from './pages/MovieDetails';
import PersonDetails from './pages/PersonDetails';
import SearchResults from './pages/SearchResults';
import UpcomingMovies from './pages/UpcomingMovies';
import PopularMovies from './pages/PopularMovies';
import FilmTransition from './components/FilmTransition';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const isAuth = authUtils.isAuthenticated();
    setLoggedIn(isAuth);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setLoggedIn(true);
    setShowTransition(false);
  };

  const handleLogout = () => {
    authUtils.clearAuth();
    setLoggedIn(false);
  };

  const handleNavigateToHome = () => {
    setShowTransition(true);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      {showTransition && <FilmTransition onComplete={handleTransitionComplete} />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing onNavigateToHome={handleNavigateToHome} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            loggedIn ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/discover"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <Discover />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/rate"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <AddMovies />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/library"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <MyMovies />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/watchlist"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <Watchlist />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <Profile />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/settings"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <Settings />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/help"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <Help />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/legal/privacy-policy"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <PrivacyPolicy />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/movie/:id/:slug"
          element={
            loggedIn ? (
              <MovieDetails onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/person/:id/:slug"
          element={
            loggedIn ? (
              <PersonDetails onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/search" 
          element={
            loggedIn ? (
              <SearchResults onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route
          path="/upcoming"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <UpcomingMovies />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/popular"
          element={
            loggedIn ? (
              <AppLayout onLogout={handleLogout}>
                <PopularMovies />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={loggedIn ? "/home" : "/"} replace />} />
      </Routes>
    </Router>
  );
}