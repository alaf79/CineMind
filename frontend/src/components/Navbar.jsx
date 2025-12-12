import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';
import logo from '../assets/logo.png';
import { FiSettings } from 'react-icons/fi';

export default function Navbar({ loggedIn, onLogout, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/', { replace: true });
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (authUtils.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    setMobileMenuOpen(false);
  };

  const handleSignupClick = () => {
    if (authUtils.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login?signup=true');
    }
    setMobileMenuOpen(false);
  };

  const isAuthPage = location.pathname.startsWith('/login');
  const isLandingPage = location.pathname === '/';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menu buttons
  const menuButtons = loggedIn
    ? [
        { label: 'Discover', tab: 'discover' },
        { label: 'Add Movies', tab: 'rate' },
        { label: 'My Movies', tab: 'library' },
        { label: 'Profile', tab: 'profile' },
      ]
    : [];

  // Desktop tab button
  const renderTabButton = (btn) => (
    <button
      key={btn.tab}
      className="relative py-2 px-3 font-semibold cursor-pointer transition-all duration-200 group"
      onClick={() => setActiveTab(btn.tab)}
    >
      {btn.label}
      <span
        className={`absolute left-0 bottom-0 w-full h-0.5 transform scale-x-0 origin-center transition-transform duration-300
          ${activeTab === btn.tab
            ? 'scale-x-100 bg-blue-500'
            : 'group-hover:scale-x-100 bg-gray-600'} 
        `}
      ></span>
    </button>
  );

  // Mobile tab button
  const renderTabButtonMobile = (btn) => (
    <button
      key={btn.tab}
      className="relative py-2 px-3 font-semibold w-full text-center cursor-pointer transition-all duration-200 group"
      onClick={() => {
        setActiveTab(btn.tab);
        setMobileMenuOpen(false);
      }}
    >
      {btn.label}
      <span
        className={`absolute left-0 bottom-0 w-full h-0.5 transform scale-x-0 origin-center transition-transform duration-300
          ${activeTab === btn.tab
            ? 'scale-x-100 bg-blue-500'
            : 'group-hover:scale-x-100 bg-gray-600'} 
        `}
      ></span>
    </button>
  );

  return (
    <nav className="w-full bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate(loggedIn ? '/dashboard' : '/')}
          >
            <img src={logo} alt="Logo" className="w-10 h-10 mr-3" />
            <span className="text-2xl font-bold">CineMind</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {loggedIn && menuButtons.map(renderTabButton)}
            {!loggedIn && isLandingPage && (
              <>
                <button
                  className="px-4 py-2 text-white hover:text-blue-400 transition"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  onClick={handleSignupClick}
                >
                  Sign Up
                </button>
              </>
            )}

            {loggedIn && (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  className="p-2 rounded-full hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FiSettings className="w-6 h-6" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-gray-800 rounded-md shadow-lg py-2 z-50 min-w-[10rem]">
                    <div className="absolute -top-2 right-3 w-3 h-3 bg-gray-800 rotate-45"></div>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm cursor-pointer"
                      onClick={() => navigate('/edit-profile')}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm cursor-pointer"
                      onClick={() => navigate('/settings')}
                    >
                      Settings
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm cursor-pointer"
                      onClick={() => navigate('/help')}
                    >
                      Help / FAQ
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm cursor-pointer"
                      onClick={() => navigate('/privacy-policy')}
                    >
                      Privacy Policy
                    </button>
                    <hr className="border-gray-700 my-1" />
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-red-700 text-red-500 font-semibold transition rounded-b-md text-sm cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            {(!isAuthPage) && (
              <button
                className="flex flex-col justify-center items-center w-8 h-8 relative cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
              <span
                className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out
                  ${mobileMenuOpen ? 'rotate-45' : '-translate-y-2'}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out
                  ${mobileMenuOpen ? 'opacity-0' : 'translate-y-0'}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out
                  ${mobileMenuOpen ? '-rotate-45' : 'translate-y-2'}`}
              ></span>
            </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden flex flex-col items-center space-y-2 overflow-hidden transition-[max-height] duration-300 ease-in-out
            ${mobileMenuOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
        >
          {loggedIn && menuButtons.map(renderTabButtonMobile)}

          {loggedIn && (
            <div className="flex flex-col items-center space-y-1 w-full">
              <button className="w-full text-center py-2 px-3 hover:bg-gray-700 transition rounded-md cursor-pointer" onClick={() => { navigate('/edit-profile'); setMobileMenuOpen(false); }}>
                Edit Profile
              </button>
              <button className="w-full text-center py-2 px-3 hover:bg-gray-700 transition rounded-md cursor-pointer" onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}>
                Settings
              </button>
              <button className="w-full text-center py-2 px-3 hover:bg-gray-700 transition rounded-md cursor-pointer" onClick={() => { navigate('/help'); setMobileMenuOpen(false); }}>
                Help / FAQ
              </button>
              <button className="w-full text-center py-2 px-3 hover:bg-gray-700 transition rounded-md cursor-pointer" onClick={() => { navigate('/privacy-policy'); setMobileMenuOpen(false); }}>
                Privacy Policy
              </button>
              <button className="w-full text-center py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition cursor-pointer" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {!loggedIn && isLandingPage && (
            <div className="flex flex-col items-center w-full space-y-2">
              <button className="w-full text-center py-2 px-3 hover:text-blue-400 transition cursor-pointer" onClick={handleLoginClick}>
                Login
              </button>
              <button className="w-full text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition cursor-pointer" onClick={handleSignupClick}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
