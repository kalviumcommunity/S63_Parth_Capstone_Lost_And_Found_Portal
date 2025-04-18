import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    // sticky: Makes it stick
    // top-0: Position at the top
    // bg-white: White background
    // z-10: Stacking order (keeps it above other content)
    // p-4: Padding (1rem)
    // shadow-md: Medium box shadow
    <nav className="sticky top-0 z-10 bg-white p-4 shadow-md">
      {/*
        flex: Enables flexbox layout
        justify-between: Pushes logo/brand to left and links to right
        items-center: Vertically aligns items in the center
        max-w-screen-xl: Sets max width (adjust xl, lg, etc. based on your design)
        mx-auto: Centers the container horizontally
      */}
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Website Name/Logo */}
        <Link to="/" className="text-2xl font-bold text-black no-underline">
          Founder's Hub
        </Link>

        {/* Navigation Links Container */}
        {/* flex: Lays out links horizontally
            gap-6: Adds space (1.5rem) between links */}
        <div className="flex items-center gap-6">
          <Link to="/about" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">About</Link>
          <Link to="/guidelines" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Guidelines</Link>
          <Link to="/disclaimer" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Disclaimer</Link>
          <Link to="/donate" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Donate</Link>
          <Link to="/contact" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Contact</Link>
          <Link to="/careers" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Careers</Link>
          <Link to="/make-payment" className="text-black no-underline transition-colors duration-200 hover:text-blue-600">Make Payment</Link>

          {/* Login Button - Styled differently */}
          <Link
            to="/login"
            className="rounded border border-black px-4 py-2 text-black no-underline transition-colors duration-200 hover:bg-gray-100"
          >
            Login
          </Link>
          {/* Note: We'll add logic later to show "Logout" if the user is logged in */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;