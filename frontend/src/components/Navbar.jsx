// src/components/Navbar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Consider using navigate hook if needed for more complex logout logic
    window.location.href = '/login'; // Simple redirect for now
  };

  // Helper for NavLink active class styling
  const getNavLinkClass = ({ isActive }) =>
    `no-underline transition-colors duration-200 hover:text-blue-600 px-1 py-1 whitespace-nowrap ${ // Added whitespace-nowrap
      isActive ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-700'
    }`;

  // Profile Picture URL and error handling
  const profilePicUrl = user?.profilePicture
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${user.profilePicture}`
        : '/default-profile-placeholder.png';
  const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/default-profile-placeholder.png';
    };

  return (
    <nav className="sticky top-0 z-50 bg-white p-4 shadow-md">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-gray-800 no-underline mr-6">
          Founder's Hub
        </Link>

        {/* Links & Auth Area Container */}
        {/* Using justify-between on the main container helps push items apart */}
        <div className="flex items-center gap-x-3 md:gap-x-5 gap-y-2 flex-wrap"> {/* Adjusted gaps */}

          {/* Primary Public Links */}
          <NavLink to="/about" className={getNavLinkClass}>About</NavLink>
          <NavLink to="/guidelines" className={getNavLinkClass}>Guidelines</NavLink>
          <NavLink to="/disclaimer" className={getNavLinkClass}>Disclaimer</NavLink>
          <NavLink to="/contact" className={getNavLinkClass}>Contact</NavLink>
          {/* Add Donate etc. here if needed */}


          {/* Spacer - pushes auth section to the right */}
          <div className="flex-grow"></div>

          {/* Auth / User Actions Section */}
          <div className="flex items-center gap-3"> {/* Group user/auth links */}
            {isAuthenticated && user ? (
              // --- Logged In State ---
              <>
                {/* --- ADDED Report Buttons --- */}
                <NavLink
                  to="/report-lost"
                  className={getNavLinkClass + " text-red-600 hover:text-red-800"} // Optional distinct color
                  title="Report an item you lost"
                >
                  Report Lost
                </NavLink>
                <NavLink
                  to="/report-found"
                  className={getNavLinkClass + " text-green-600 hover:text-green-800"} // Optional distinct color
                  title="Report an item you found"
                >
                  Report Found
                </NavLink>
                {/* --- END ADDED --- */}

                <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
                <NavLink to="/my-reports" className={getNavLinkClass}>My Reports</NavLink>

                {/* Profile Picture Link */}
                <NavLink to="/profile" className="flex items-center rounded-full hover:bg-gray-100 p-0.5" title="My Profile">
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                    onError={handleImageError}
                  />
                </NavLink>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="rounded border border-gray-400 bg-transparent px-3 py-1.5 text-sm text-gray-600 no-underline transition-colors duration-200 hover:bg-gray-100 hover:border-gray-500"
                  title="Log Out"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- Logged Out State ---
              <>
                <NavLink
                  to="/login"
                  className="rounded border border-gray-300 bg-transparent px-3 py-1.5 text-sm text-gray-700 no-underline transition-colors duration-200 hover:bg-gray-100"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm text-white no-underline transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700"
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;