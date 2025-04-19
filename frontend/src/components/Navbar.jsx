// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Using Link for now

const Navbar = () => {
  // Basic state for now - we'll add auth logic later
  const isLoggedIn = false;

  return (
    <nav className="sticky top-0 z-50 bg-white p-4 shadow-md">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-black no-underline mr-6">
          Founder's Hub
        </Link>

        {/* Links & Auth Area */}
        <div className="flex flex-grow items-center justify-end gap-x-4 md:gap-x-6 gap-y-2 flex-wrap"> {/* Adjusted gaps */}
          {/* Primary Navigation */}
          <Link to="/about" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">About</Link>
          <Link to="/guidelines" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Guidelines</Link>
          <Link to="/disclaimer" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Disclaimer</Link>
          <Link to="/contact" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Contact</Link>
          {/* Optional Links - Add if needed */}
          {/* <Link to="/donate" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Donate</Link> */}
          {/* <Link to="/make-payment" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Make Payment</Link> */}
          {/* <Link to="/careers" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Careers</Link> */}


          {/* Auth Buttons - Conditional Rendering */}
          <div className="flex items-center gap-3 ml-4 md:ml-auto"> {/* Ensure spacing */}
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Profile</Link>
                <button
                  onClick={() => { /* Implement logout */ }}
                  className="rounded border border-red-500 bg-transparent px-3 py-1.5 text-sm text-red-500 no-underline transition-colors duration-200 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded border border-gray-300 bg-transparent px-3 py-1.5 text-sm text-black no-underline transition-colors duration-200 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm text-white no-underline transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;