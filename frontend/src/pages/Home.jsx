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
import CardSkeleton from "../components/CardSkeleton";
import { tmdbService } from "../api/tmdb";
import { weeklyBriefService } from "../api/weeklyBrief";

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // TMDB API state
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [featuredPeople, setFeaturedPeople] = useState([]);
  const [weeklyBrief, setWeeklyBrief] = useState({ dateRange: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded Cinema News
  const cinemaNews = [
    {
      headline: "Christopher Nolan's Next Film Sets July 2026 Release Date",
      description:
        "Universal Pictures confirms a summer release for Nolan's latest original feature.",
      source: "Variety",
      image:
        "https://img.logo.dev/variety.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true",
      url: "https://variety.com",
      timeAgo: "2 days ago"
    },
    {
      headline: "A24 Leads Independent Spirit Awards With 12 Nominations",
      description:
        "The indie powerhouse dominates major categories as awards season heats up.",
      source: "The Hollywood Reporter",
      image:
        "https://img.logo.dev/hollywoodreporter.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true",
      url: "https://hollywoodreporter.com",
      timeAgo: "3 days ago"
    },
    {
      headline: "Cannes Film Festival Reveals 2025 Competition Lineup",
      description:
        "Festival organizers announce a director-driven slate for the upcoming edition.",
      source: "Deadline",
      image:
        "https://img.logo.dev/deadline.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true",
      url: "https://deadline.com",
      timeAgo: "5 days ago"
    },
    {
      headline: "Warner Bros. Unveils Ambitious 2025–2026 Theatrical Slate",
      description:
        "Major franchises and original projects headline the studio's roadmap.",
      source: "IndieWire",
      image:
        "https://img.logo.dev/indiewire.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true",
      url: "https://indiewire.com",
      timeAgo: "6 days ago"
    }
  ];

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

  // Fetch TMDB data on mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting to fetch home data...');
        
        const [moviesData, peopleData] = await Promise.allSettled([
          tmdbService.getUpcoming(),
          tmdbService.getTrendingPeople()
        ]);
        
        console.log('Movies result:', moviesData);
        console.log('People result:', peopleData);
        
        // Handle movies
        if (moviesData.status === 'fulfilled') {
          setUpcomingMovies(moviesData.value || []);
          
          // Generate weekly brief after we have movie data
          try {
            const brief = await weeklyBriefService.generateBrief(moviesData.value || []);
            setWeeklyBrief(brief);
          } catch (err) {
            console.error('Failed to generate weekly brief:', err);
            // Keep default empty state
          }
        } else {
          console.error('Movies fetch failed:', moviesData.reason);
          setUpcomingMovies([]);
        }
        
        // Handle people
        if (peopleData.status === 'fulfilled') {
          setFeaturedPeople(peopleData.value || []);
        } else {
          console.error('People fetch failed:', peopleData.reason);
          setFeaturedPeople([]);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError('Failed to load content. Please refresh the page.');
        setUpcomingMovies([]);
        setFeaturedPeople([]);
      } finally {
        setLoading(false);
        console.log('Finished loading home data');
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    // Scroll to top when tab/page changes
    const contentArea = document.querySelector('.tab-content');
    if (contentArea) {
      contentArea.scrollTo(0, 0);
    }
  }, [currentTab]);

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

                {/* Loading State with Skeletons */}
                {loading && (
                  <>
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Upcoming Releases</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                      </div>
                    </div>
                    <div className="mb-12">
                      <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-8 animate-pulse">
                        <div className="h-4 bg-slate-800 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-3 bg-slate-800 rounded w-full"></div>
                          <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Featured Talent</h2>
                      <div className="flex gap-6 overflow-x-auto pb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="flex-shrink-0 w-48">
                            <CardSkeleton isPerson={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {/* Upcoming Releases */}
                {!loading && (
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
                )}

                {/* Newsletter / Weekly Brief */}
                {!loading && (
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
                          <p className="text-slate-300 text-sm mb-4">
                            {weeklyBrief.dateRange || 'December 9-15, 2024'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4 text-slate-300">
                        {weeklyBrief.content ? (
                          // Split content into paragraphs and render
                          weeklyBrief.content
                            .split('\n\n')
                            .filter(p => p.trim().length > 0)
                            .map((paragraph, idx) => (
                              <p key={idx}>{paragraph.trim()}</p>
                            ))
                        ) : (
                          // Fallback content while loading
                          <>
                            <p>
                              This week in cinema: Robert Eggers' highly anticipated "Nosferatu" remake is set to haunt theaters on Christmas Day, bringing gothic horror back to the big screen. Meanwhile, Denis Villeneuve continues post-production on "Dune: Prophecy," with early test screenings receiving enthusiastic responses from critics.
                            </p>
                            <p>
                              Awards season is heating up as Oscar contenders emerge from the festival circuit. A24's latest acquisitions are generating significant buzz, with five international films poised to make waves in the art house circuit. Industry insiders are already speculating about potential nominations across all major categories.
                            </p>
                            <p className="text-sm text-purple-300 font-medium">
                              Stay tuned for more updates as we approach the 2025 awards season and exciting new releases.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Featured Talent */}
                {!loading && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Featured Talent</h2>
                    <div className="relative overflow-visible">
                      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory talent-scroll">
                        {featuredPeople.length === 0 && (
                          <p className="text-slate-400">No featured talent available</p>
                        )}
                        {featuredPeople.map((person, i) => (
                          <div key={person.id} className="flex-shrink-0 w-48 snap-start">
                            <Card movie={person} showRating={false} index={i} isPerson={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cinema News Feed */}
                {!loading && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Cinema News</h2>
                    <div className="space-y-4">
                      {cinemaNews.map((news, i) => (
                        <a 
                          key={i}
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-4 border border-slate-800 rounded-lg p-4 hover:border-purple-400/50 transition group cursor-pointer hover:shadow-lg hover:shadow-purple-500/10"
                        >
                          <img 
                            src={news.image}
                            alt={news.headline}
                            className="w-24 h-32 object-cover rounded flex-shrink-0 ring-1 ring-slate-700"
                            onError={(e) => {
                              e.target.src = 'https://img.logo.dev/variety.com?token=pk_Njb2Bg3ySle5ZdsTqsfQpA&size=200&format=png&retina=true';
                            }}
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-semibold text-slate-50 mb-1 group-hover:text-purple-300 transition line-clamp-2">{news.headline}</h3>
                            {news.description && (
                              <p className="text-sm text-slate-400 mb-2 line-clamp-2">{news.description}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-purple-400 font-medium">{news.source}</span>
                              <span className="text-xs text-slate-600">•</span>
                              <span className="text-xs text-slate-500">{news.timeAgo}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
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

        /* Hide scrollbar for talent section */
        .talent-scroll::-webkit-scrollbar {
          display: none;
        }

        .talent-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}