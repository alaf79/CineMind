import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddMovies from "../pages/AddMovies";
import MyMovies from "../pages/MyMovies";
import Discover from "../pages/Discover";
import Profile from "../pages/Profile";
import Settings from "./Settings";
import Help from "./Help";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import Card from "../components/Card";

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathSegments = location.pathname.split("/");
  const section = pathSegments[2] || "home";
  const subsection = pathSegments[3] || null;

  const currentTab = subsection ? `${section}/${subsection}` : section;

  const handleTabClick = (tab) => {
  // Don't do anything if clicking the same tab
    if ((tab === "home" && section === "home") || 
        (tab !== "home" && currentTab === tab)) {
      return;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (tab === "home") navigate(`/home`);
      else navigate(`/home/${tab}`);
      
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  useEffect(() => {
    // Scroll to top when tab/page changes
    const contentArea = document.querySelector('.tab-content');
    if (contentArea) {
      contentArea.scrollTo(0, 0);
    }
  }, [currentTab]);

  // Placeholder data
  const upcomingMovies = [
    { 
      id: 1001,
      title: 'Dune: Prophecy', 
      date: 'Jan 15, 2025', 
      director: 'Alison Schapker',
      poster: 'https://image.tmdb.org/t/p/original/oWVohNsxkxA3u92EzRo8fTuXIS0.jpg',
      year: 2025
    },
    { 
      id: 1002,
      title: 'Captain America: Brave New World', 
      date: 'Feb 14, 2025', 
      director: 'Julius Onah',
      poster: 'https://image.tmdb.org/t/p/original/mFzFJc1XnGqaEbyac2KcCFJx8Uo.jpg',
      year: 2025
    },
    { 
      id: 1003,
      title: 'Nosferatu', 
      date: 'Dec 25, 2024', 
      director: 'Robert Eggers',
      poster: 'https://image.tmdb.org/t/p/original/wQ8MHiyH4ETqSSovpzZmrWAxQ6y.jpg',
      year: 2024
    },
    { 
      id: 1004,
      title: 'Mickey 17', 
      date: 'Mar 7, 2025', 
      director: 'Bong Joon-ho',
      poster: 'https://image.tmdb.org/t/p/original/fjIHkLGIZdjKIKe252gSFt5QzVK.jpg',
      year: 2025
    },
  ];

  const cinemaNews = [
    { 
      headline: 'Christopher Nolan Announces New Project', 
      source: 'Variety',
      image: 'https://image.tmdb.org/t/p/original/x5JKwcrl7NzaSWfTFh6bIPCsqJd.jpg'
    },
    { 
      headline: 'A24 Acquires Rights to 5 International Films', 
      source: 'The Hollywood Reporter',
      image: 'https://img.logo.dev/a24films.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true'
    },
    { 
      headline: 'Oscars 2025: Major Contenders Emerge', 
      source: 'Deadline',
      image: 'https://img.logo.dev/oscars.org?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true'
    },
    { 
      headline: 'Netflix Greenlights Three Original Series', 
      source: 'IndieWire',
      image: 'https://img.logo.dev/netflix.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true'
    },
    { 
      headline: 'Cannes Film Festival Announces 2025 Lineup', 
      source: 'Screen Daily',
      image: 'https://img.logo.dev/festival-cannes.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true'
    },
  ];

  const featuredPeople = [
    {
      name: 'Margot Robbie',
      role: 'Actor',
      notableWork: 'Barbie, I, Tonya',
      poster: 'https://image.tmdb.org/t/p/w500/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg'
    },
    {
      name: 'Denis Villeneuve',
      role: 'Director',
      notableWork: 'Dune, Arrival',
      poster: 'https://image.tmdb.org/t/p/original/433lXlkdMGXzrpwnKM4Ul1sln15.jpg'
    },
    {
      name: 'Florence Pugh',
      role: 'Actor',
      notableWork: 'Midsommar, Little Women',
      poster: 'https://image.tmdb.org/t/p/w500/6Sjz9teWjrMY9lF2o9FCo4XmoRh.jpg'
    },
    {
      name: 'Greta Gerwig',
      role: 'Director',
      notableWork: 'Barbie, Lady Bird',
      poster: 'https://image.tmdb.org/t/p/original/6MwQ2GstYr0wnhp1eTOAbVMNBGN.jpg'
    },
    {
      name: 'Timothée Chalamet',
      role: 'Actor',
      notableWork: 'Dune, Call Me By Your Name',
      poster: 'https://image.tmdb.org/t/p/w500/BE2sdjpgsa2rNTFa66f7upkaOP.jpg'
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-50">
      <Navbar
        loggedIn={true}
        onLogout={onLogout}
        activeTab={currentTab}
        setActiveTab={handleTabClick}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 w-full overflow-y-auto tab-content">
          {currentTab === "home" && (
            <div className="px-6 py-12">
              <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-12">
                  <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Cinema Hub</h1>
                  <p className="text-slate-400">Stay updated with the film world</p>
                </div>

                {/* Upcoming Releases */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Upcoming Releases</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {upcomingMovies.map((film, i) => (
                      <div key={film.id}>
                        <Card movie={film} showRating={false} index={i} />
                        <p className="text-sm text-slate-400 font-medium mt-3">{film.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter / Weekly Brief */}
                <div className="mb-12">
                  <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg p-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Weekly Brief</h2>
                        <p className="text-slate-300 text-sm mb-4">December 8-14, 2024</p>
                      </div>
                    </div>
                    <div className="space-y-4 text-slate-300">
                      <p>
                        This week in cinema: Robert Eggers' highly anticipated "Nosferatu" remake is set to haunt theaters on Christmas Day, bringing gothic horror back to the big screen. Meanwhile, Denis Villeneuve continues post-production on "Dune: Prophecy," with early test screenings receiving enthusiastic responses from critics.
                      </p>
                      <p>
                        Awards season is heating up as Oscar contenders emerge from the festival circuit. A24's latest acquisitions are generating significant buzz, with five international films poised to make waves in the art house circuit. Industry insiders are already speculating about potential nominations across all major categories.
                      </p>
                      <p className="text-sm text-purple-300 font-medium">
                        Stay tuned for more updates as we approach the 2025 awards season and exciting new releases.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actor / Director Highlights */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Featured Talent</h2>
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {featuredPeople.map((person, i) => (
                        <div key={person.id} className="flex-shrink-0 w-48 snap-start">
                          <Card movie={person} showRating={false} index={i} isPerson={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cinema News Feed */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Cinema News</h2>
                  <div className="space-y-4">
                    {cinemaNews.map((news, i) => (
                      <div key={i} className="flex gap-4 border border-slate-800 rounded-lg p-4 hover:border-purple-400/50 transition group cursor-pointer hover:shadow-lg hover:shadow-purple-500/10">
                        <img 
                          src={news.image}
                          alt={news.headline}
                          className="w-24 h-32 object-cover rounded flex-shrink-0 ring-1 ring-slate-700"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="font-semibold text-slate-50 mb-2 group-hover:text-purple-300 transition line-clamp-2">{news.headline}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-400 font-medium">{news.source}</span>
                            <span className="text-xs text-slate-600">•</span>
                            <span className="text-xs text-slate-500">2 hours ago</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === "discover" && <Discover />}

          {currentTab === "rate" && <AddMovies />}

          {currentTab === "library" && <MyMovies />}

          {currentTab === "profile" && <Profile />}

          {currentTab === "settings" && <Settings />}

          {currentTab === "help" && <Help />}

          {currentTab === "legal/privacy-policy" && <PrivacyPolicy />}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes tabEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tabExit {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .tab-enter {
          animation: tabEnter 0.3s ease-out forwards;
        }

        .tab-exit {
          animation: tabExit 0.15s ease-in forwards;
        }

        .tab-content {
          width: 100%;
          height: 100%;
        }

        /* Custom Scrollbar */
        .tab-content::-webkit-scrollbar {
          width: 8px;
        }

        .tab-content::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }

        .tab-content::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.4), rgba(168, 85, 247, 0.4));
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .tab-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.6), rgba(168, 85, 247, 0.6));
        }

        /* Firefox */
        .tab-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.4) rgba(15, 23, 42, 0.3);
        }
      `}</style>
    </div>
  );
}