import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { authUtils } from "./utils/authUtils";
import FilmTransition from "./components/FilmTransition";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const token = authUtils.getToken();
    if (token) {
      setLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    setShowTransition(true);
  };

  const handleNavigateToDashboard = () => {
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  const handleLogout = () => {
    authUtils.clearAuth();
    setLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      {showTransition && <FilmTransition onComplete={handleTransitionComplete} />}
      <Routes>
        <Route path="/" element={<Landing onNavigateToDashboard={handleNavigateToDashboard} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/dashboard/*"
          element={
            loggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;