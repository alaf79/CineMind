import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddMovies from "../pages/AddMovies";
import MyMovies from "../pages/MyMovies";
import Discover from "../pages/Discover";
import Profile from "../pages/Profile";

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const currentTab = pathSegments[2] || "dashboard";

  const handleTabClick = (tab) => {
    if (tab === "dashboard") navigate(`/dashboard`);
    else navigate(`/dashboard/${tab}`);
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-gray-900 text-white">
      <Navbar
        loggedIn={true}
        onLogout={onLogout}
        activeTab={currentTab}
        setActiveTab={handleTabClick}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentTab === "dashboard" && (
          <div className="flex-1 w-full overflow-y-auto scrollbar-hide px-4 sm:px-8 py-6">

            {/* HEADER */}
            <div className="w-full max-w-5xl mx-auto mb-8">
              <h2 className="text-3xl font-bold">Welcome</h2>
              <p className="text-gray-400 mt-1">
                Your personal movie command center.
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-gray-800/70 backdrop-blur p-5 rounded-xl shadow-md border border-gray-700">
                <p className="text-sm text-gray-400">Movies Rated</p>
                <h3 className="text-3xl font-semibold mt-2">124</h3>
              </div>

              <div className="bg-gray-800/70 backdrop-blur p-5 rounded-xl shadow-md border border-gray-700">
                <p className="text-sm text-gray-400">Watchlist</p>
                <h3 className="text-3xl font-semibold mt-2">37</h3>
              </div>

              <div className="bg-gray-800/70 backdrop-blur p-5 rounded-xl shadow-md border border-gray-700">
                <p className="text-sm text-gray-400">Avg. Rating</p>
                <h3 className="text-3xl font-semibold mt-2">7.8</h3>
              </div>

              <div className="bg-gray-800/70 backdrop-blur p-5 rounded-xl shadow-md border border-gray-700">
                <p className="text-sm text-gray-400">Hours Watched</p>
                <h3 className="text-3xl font-semibold mt-2">243h</h3>
              </div>
            </div>

            {/* SEPARATOR */}
            <div className="h-[1px] bg-gray-700 my-10 max-w-5xl mx-auto"></div>

            {/* FEATURE BLOCKS */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Recommended for You</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Based on your ratings and favorites.
                </p>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  onClick={() => handleTabClick("discover")}
                >
                  Explore Discover
                </button>
              </div>

              <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Continue Rating</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Add movies to improve recommendations.
                </p>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  onClick={() => handleTabClick("rate")}
                >
                  Rate Movies
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTab === "discover" && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <Discover />
          </div>
        )}

        {currentTab === "rate" && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <AddMovies />
          </div>
        )}

        {currentTab === "library" && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <MyMovies />
          </div>
        )}

        {currentTab === "profile" && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <Profile />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
