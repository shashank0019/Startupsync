import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useAuth';
import { getInitials } from '../utils/validation';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount, loadNotifications } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SS</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">StartupSync</span>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/startups" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Discover
            </Link>
            <Link to="/teams" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Teams
            </Link>
            <Link to="/chat" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Messages
            </Link>
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 text-gray-600 hover:text-gray-900 transition"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold hover:shadow-md transition"
                >
                  {getInitials(user?.firstName || '', user?.lastName || '')}
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link
                      to="/startups/create"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      🚀 Create Startup
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
