// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    // mt-auto pushes the footer down in a flex container
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-6">
      <div className="container mx-auto px-4 text-center">
        {/* Copyright Text */}
        <p className="text-sm text-gray-600">
          © {currentYear} Founder's Hub. All Rights Reserved.
        </p>

        {/* Optional Links */}
        <nav className="mt-3 text-sm">
          <Link
            to="/disclaimer"
            className="text-gray-500 hover:text-blue-600 hover:underline mx-2 transition-colors duration-200"
          >
            Disclaimer & Agreement
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            to="/guidelines"
            className="text-gray-500 hover:text-blue-600 hover:underline mx-2 transition-colors duration-200"
          >
            Guidelines
          </Link>
           <span className="text-gray-300">|</span>
           <Link
            to="/contact"
            className="text-gray-500 hover:text-blue-600 hover:underline mx-2 transition-colors duration-200"
          >
            Contact Us
          </Link>
          {/* Add other relevant links like Privacy Policy, Terms of Service if needed */}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;