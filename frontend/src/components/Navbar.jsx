import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-white p-4 shadow-md">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Website Name/Logo */}
        <Link to="/" className="text-2xl font-bold text-black no-underline">
          Founder's Hub
        </Link>

        {/* Navigation Links Container */}
        <div className="flex items-center gap-6">
          {/* Regular Links */}
          <Link to="/about" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">About</Link>
          <Link to="/guidelines" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Guidelines</Link>
          <Link to="/disclaimer" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Disclaimer</Link>
          <Link to="/donate" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Donate</Link>
          <Link to="/contact" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Contact</Link>
          <Link to="/careers" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Careers</Link>
          <Link to="/make-payment" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Make Payment</Link>

          {/* Auth Buttons Container */}
          <div className="flex items-center gap-3"> {/* Added a div to group auth buttons */}
            {/* Login Button */}
            <Link
              to="/login"
              className="rounded border border-gray-300 px-4 py-2 text-black no-underline transition-colors duration-200 hover:bg-gray-100"
            >
              Login
            </Link>

            {/* Signup Button - Styled slightly differently (e.g., filled) */}
            <Link
              to="/signup" // <-- Link to the Signup page
              className="rounded border border-blue-600 bg-blue-600 px-4 py-2 text-white no-underline transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700" // <-- Added Signup link
            >
              Signup
            </Link>
          </div>
          {/* Note: Later, we'll hide Login/Signup and show Logout if the user is authenticated */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;